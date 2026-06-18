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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // 1. මේ ප්‍රොඩක්ට් එක අයිති යූසර් (Seller)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 2. මේ ප්‍රොඩක්ට් එක අයිති කැටගරිය (Electronics, Clothes වගේ)
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            $table->string('name');
            $table->double('price');
            $table->text('image_path')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
