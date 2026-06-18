<?php

namespace App\Http\Controllers;

use App\Events\ConversationCreated;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    // 1. පරිශීලකයාගේ සියලුම චැට් රූම්ස් (Inbox) පෙන්වන පේජ් එක
    public function index()
    {
        $userId = Auth::id();

        // 💡 ඩැමේජ් නොවන ඔප්ටිමයිසේෂන් එක:
        // Subqueries පාවිච්චි කරලා ඩේටාබේස් එකෙන්ම එකම පාරෙන් Last Message ID එක සහ Unread Count එක අරගන්නවා.
        $conversations = Conversation::where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->with(['buyer', 'seller', 'product'])
            ->addSelect([
                // මේ චැට් එකේ අන්තිම මැසේජ් එකේ ID එක උප-ක්වෙරි එකකින් ගන්නවා
                'latest_message_id' => Message::select('id')
                    ->whereColumn('conversation_id', 'conversations.id')
                    ->latest()
                    ->take(1),
            ])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                // ලොග් වෙලා ඉන්න යූසර්ට ලැබුණු, තවම කියවලා නැති මැසේජ් ගණන ඩේටාබේස් එකෙන්ම ගණන් කරනවා
                $query->where('sender_id', '!=', $userId)->where('is_read', false);
            }])
            ->get()
            ->map(function ($conversation) {
                // 💡 ඔයාගේ මුල් ලොජික් එක 100% ක් මෙතන තියෙනවා:
                // කලින් වගේ හැම පාරම database එකට query ගහන්නේ නැතුව, උඩින් ආපු latest_message_id එකෙන් විතරක් මැසේජ් එක ලෝඩ් කරනවා.
                $lastMessage = $conversation->latest_message_id
                    ? Message::find($conversation->latest_message_id)
                    : null;

                // 💡 ඔයා හදපු නිවැරදි නිපැයුම (Output ව්‍යුහය):
                $conversation->last_message = $lastMessage ? $lastMessage->message : null;
                $conversation->unread_count = $conversation->unread_count; // උඩින් ආපු count එක කෙලින්ම යනවා

                return $conversation;
            });

        return Inertia::render('Chat/Inbox', [
            'conversations' => $conversations,
        ]);
    }

    public function start(Request $request, Product $product)
    {
        $buyer_id = $request->user()->id;
        $seller_id = $product->user_id;

        if ($buyer_id === $seller_id) {
            return redirect()->back()->with('error', 'You cannot chat with yourself.');
        }

        // firstOrCreate පාවිච්චි කරලා චැට් එක ගන්නවා
        $conversation = Conversation::firstOrCreate([
            'buyer_id' => $buyer_id,
            'seller_id' => $seller_id,
            'product_id' => $product->id,
        ]);

        // 💡 සාර්ථකව අලුත්ම චැට් එකක් සෑදුනේ නම් පමණක් Seller ට Live Notification එකක් යවනවා
        if ($conversation->wasRecentlyCreated) {
            broadcast(new ConversationCreated($conversation))->toOthers();
        }

        return redirect()->route('chat.show', $conversation->id);
    }

    // 3. තෝරාගත් එක් චැට් රූම් එකක් (මැසේජ් ලොග් එක) පෙන්වීම
    public function show(Request $request, Conversation $conversation)
    {
        $userId = $request->user()->id;

        if ($userId !== $conversation->buyer_id && $userId !== $conversation->seller_id) {
            abort(403);
        }

        // කියවලා නැති මැසේජ් Read කරනවා
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return Inertia::render('Chat/Show', [
            'conversation' => $conversation->load(['buyer', 'seller', 'product']),
            'messages' => Message::where('conversation_id', $conversation->id)
                ->with('sender')
                ->oldest()
                ->get(),
        ]);
    }

    // 4. චැට් එක ඇතුළේ සිට අලුත් මැසේජ් එකක් යැවීම (Save කිරීම)
    public function storeMessage(Request $request, Conversation $conversation)
    {
        if ($request->user()->id !== $conversation->buyer_id && $request->user()->id !== $conversation->seller_id) {
            abort(403);
        }

        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'message' => $request->message,
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return redirect()->back();
    }
}
