<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        // 💡 මැසේජ් එක සේව් කරපු ගමන් ඒක එවපු සෙන්ඩර් සහ ඒකට අදාළ කන්වර්සේෂන් එක ලෝඩ් කරගන්නවා
        // 💡 පරණ වැඩ වලට හානි නොකර, අලුත් චැට් කාඩ් එකක් ලයිව් රෙන්ඩර් කරන්න අවශ්‍ය සියලුම රිලේෂන්ස් ටික මෙතනින් ලෝඩ් කරනවා

        $this->message = $message->load([
            'sender',
            'conversation.buyer',
            'conversation.seller',
            'conversation.product',
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        $conversation = $this->message->conversation;
        $senderId = $this->message->sender_id;

        // 💡 මැසේජ් එක එවපු කෙනා බයර් නම්, ලබන කෙනා (Receiver) සෙලර් වේ. නැත්නම් බයර් වේ.
        $receiverId = ($senderId === $conversation->buyer_id)
            ? $conversation->seller_id
            : $conversation->buyer_id;

        return [
            // 1. චැට් රූම් එක ඇතුළේ ඉන්න අයට ලයිව් පේන්න (දැනටමත් වැඩ)
            new PrivateChannel('chat.' . $this->message->conversation_id),

            // 2. 💡 මැසේජ් එක ලබන කෙනාට (Receiver) කොහේ හිටියත් Inbox/Navbar අප්ඩේට් වෙන්න Global Channel එක
            new PrivateChannel('user.' . $receiverId),
        ];
    }
}
