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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            // චැට් එක පටන් ගත්තු කෙනා (Buyer)
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            // භාණ්ඩයේ අයිතිකරුවා (Seller)
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            // මොන භාණ්ඩය සම්බන්ධවද චැට් කරන්නේ (Product)
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->timestamps();

            // එකම බයර් සහ සෙලර්ට එකම ප්‍රොඩක්ට් එකක් වෙනුවෙන් හැදෙන්න පුළුවන් එක Conversation එකක් විතරයි
            $table->unique(['buyer_id', 'seller_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
