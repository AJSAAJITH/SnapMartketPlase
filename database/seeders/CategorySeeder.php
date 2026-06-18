<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // ලංකාවේ මාකට් එකට ගැලපෙන Default කැටගරි ටිකක්
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Vehicles', 'slug' => 'vehicles'],
            ['name' => 'Property', 'slug' => 'property'],
            ['name' => 'Fashion & Clothing', 'slug' => 'fashion-clothing'],
            ['name' => 'Home & Gardening', 'slug' => 'home-gardening'],
        ];
        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
