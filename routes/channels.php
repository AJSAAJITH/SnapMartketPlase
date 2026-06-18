<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

// 💡 Global User Channel: ලොග් වෙලා ඉන්න යූසර්ට එයාගේම පුද්ගලික නෝටිෆිකේෂන් චැනල් එකට විතරක් කනෙක්ට් වෙන්න අවසර දෙනවා
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Custom channel for chat conversations
Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);

    if (! $conversation) {
        return false;
    }

    // ලොග් වෙලා ඉන්න යූසර් බයර් හෝ සෙලර් නම් විතරක් චැනල් එකට කනෙක්ට් වෙන්න අවසර දෙනවා
    return (int) $user->id === (int) $conversation->buyer_id || (int) $user->id === (int) $conversation->seller_id;
});
