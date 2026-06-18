<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = ['buyer_id', 'seller_id', 'product_id'];

    // Conversation එකකට මැසේජ් ගොඩක් තියෙන්න පුළුවන්
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // මේ චැට් එක අදාළ වන ප්‍රොඩක්ට් එක
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // චැට් එකේ බයර් කවුද
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // චැට් එකේ සෙලර් කවුද
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
