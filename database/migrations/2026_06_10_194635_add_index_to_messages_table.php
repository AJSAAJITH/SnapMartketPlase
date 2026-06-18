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
        Schema::table('messages', function (Blueprint $table) {
            //
            // 💡 දැනට තියෙන ටේබල් එකට ඉන්ඩෙක්ස් එක එකතු කිරීම
            $table->index(['conversation_id', 'sender_id', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            //
            // 💡 Rollback කරද්දී මේ ඉන්ඩෙක්ස් එක විතරක් ඩ්‍රොප් කිරීම
            $table->dropIndex(['conversation_id', 'sender_id', 'is_read']);
        });
    }
};
