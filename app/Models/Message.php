<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['conversation_id', 'sender_id', 'message', 'is_read'];

    // මැසේජ් එක අයිති රූම් එක
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // මැසේජ් එක යවපු කෙනා (User)
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
