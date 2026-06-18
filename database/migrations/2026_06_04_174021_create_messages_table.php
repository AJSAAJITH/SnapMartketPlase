<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            // මේ මැසේජ් එක අයිති මොන චැට් රූම් (Conversation) එකටද?
            $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
            // මැසේජ් එක යවපු කෙනාගේ ID එක (මේක Buyer හෝ Seller කෙනෙක් වෙන්න පුළුවන්)
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            // මැසේජ් එක (Text)
            $table->text('message');
            // මැසේජ් එක කියෙව්වාද නැද්ද (Unread/Read status)
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
