<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    // 👈 ඩේටාබේස් එකට ෆෝම් එකෙන් කෙලින්ම සේව් වෙන්න අවසර දෙන කොලම් ලිස්ට් එක
    protected $fillable = [
        'category_id',
        'name',
        'price',
        'description',
        'image_path',
    ];

    // ප්‍රොඩක්ට් එකක් අයිති වෙන කැටගරි එක සෙට් කිරීම
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // ප්‍රොඩක්ට් එක දාපු යූසර්ව සෙට් කිරීම
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
