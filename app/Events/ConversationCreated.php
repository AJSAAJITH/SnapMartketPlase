<?php

namespace App\Events;

use App\Models\Conversation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; // 💡 එසැණින්ම බ්‍රෝඩ්කාස්ට් වෙන්න මේක වැදගත්
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // 💡 Frontend එකට පාස් කරන ප්‍රධාන ඩේටා ඔබ්ජෙක්ට් එක
    public $conversation;

    /**
     * Create a new event instance.
     */
    public function __construct(Conversation $conversation)
    {
        // 1. Inbox එකේ UI එකට අවශ්‍ය buyer, seller සහ product කියන සේරම රිලේෂන්ෂිප් ටික ලෝඩ් කරනවා
        $this->conversation = $conversation->load(['buyer', 'seller', 'product']);

        // 2. දැනට මැසේජ් එකක් නැති නිසා UI එක බ්‍රේක් නොවෙන්න default අගයන් මෙතනින්ම සකසනවා
        $this->conversation->last_message = 'Started a conversation...';
        $this->conversation->unread_count = 0;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        // 💡 චැට් එක පටන් ගත්තේ බයර් නිසා, අපි මේ නොටිෆිකේෂන් එක ලයිව්ම යවන්නේ සෙලර්ගේ පුද්ගලික චැනල් එකටයි.
        return [
            new PrivateChannel('user.' . $this->conversation->seller_id),
        ];
    }

    /**
     * 💡 Frontend එකේදි අපිට ලැබෙන Event Name එක පිරිසිදුව තියාගන්න මෙහෙම දානවා.
     * එතකොට Frontend එකේ 'ConversationCreated' කියලා කෙලින්ම ලිවිය හැකියි.
     */
    public function broadcastAs(): string
    {
        return 'ConversationCreated';
    }
}
