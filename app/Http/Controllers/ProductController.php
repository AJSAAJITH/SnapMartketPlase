<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // 1. හැමෝටම ප්‍රොඩක්ට්ස් ලිස්ට් එක පෙන්වන පේජ් එක (Homepage)
    public function index()
    {
        // Products ටේබල් එකේ තියෙන දත්ත, ඒවා දාපු User සහ Category එකත් එක්කම ගන්නවා
        $products = Product::with(['user', 'category'])->latest()->get();

        return Inertia::render('Welcome', [
            'products' => $products,
        ]);
    }

    // 2. අලුත් ප්‍රොඩක්ට් එකක් දාන Form එක පෙන්වන පේජ් එක (ලොග් වුණු අයට විතරයි)
    public function create()
    {
        // ඩ්‍රොප්ඩවුන් එකට දාන්න කැටගරි ටික ෆ්‍රන්ට්-එන්ඩ් එකට යවනවා
        $categories = Category::all();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    // 3. Store Product and Upload Image via Official Cloudinary SDK
    public function store(Request $request)
    {
        // 1. Data Validation
        $fields = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        // 2. Image Uploading via Cloudinary PHP SDK
        if ($request->hasFile('image')) {
            // Initialize Cloudinary using the .env URL automatically
            Configuration::instance();

            // Upload the file directly from its temporary path
            $uploadedFile = (new UploadApi())->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'snap-market/products', // Saves inside this folder in Cloudinary
                    'resource_type' => 'auto'
                ]
            );

            // Fetch the secure HTTPS URL returned by Cloudinary
            $fields['image_path'] = $uploadedFile['secure_url'];
        }

        // 3. Create Product under the authenticated user
        $request->user()->products()->create($fields);

        return redirect('/')->with('success', 'Product created successfully and saved to Cloudinary!');
    }
    // 4. තනි ප්‍රොඩක්ට් එකක විස්තර පෙන්වන පේජ් එක (Show Page)
    public function show(Product $product)
    {
        // ප්‍රොඩක්ට් එක සමඟ සම්බන්ධ (Relationships) user සහ category දත්ත ටික ලෝඩ් කරගන්නවා
        $product->load(['user', 'category']);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
