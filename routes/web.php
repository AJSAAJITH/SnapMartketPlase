<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// 1. මුල් පිටුව (Homepage)
Route::get('/', [ProductController::class, 'index'])->name('home');

// ⚠️ වැදගත්: /products/{product} රූට් එක මෙතනින් ඉවත් කර පහළට දැම්මා.

// 2. ආරක්ෂිත මාවත් (Protected Layer - ලොග් වුණු යූසර්ලාට විතරයි)
Route::middleware(['auth', 'verified'])->group(function () {

    // Default Starter Kit එකෙන් ලැබුණු Dashboard එක
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // 💡 නිවැරදි කිරීම: static route එක wildcard එකට කලින් ලෝඩ් විය යුතු නිසා මෙය ඉහළින්ම තැබුවා
    // SnapMarket: අලුත් භාණ්ඩයක් ඇතුළත් කරන Form එක පෙන්වන පේජ් එක ලෝඩ් කිරීම
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');

    // SnapMarket: Form එකෙන් එන දත්ත සහ Image එක ක්ලවුඩ් DB එකට සේව් කරන ලොජික් එක
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');

    // --- SnapMarket: Real-time Chat Routes ---
    // 1. මුළු ඉන්බොක්ස් (Inbox) එකම බලාගන්න
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');

    // 2. ප්‍රොඩක්ට් පේජ් එකේ ඉඳන් චැට් එකක් ස්ටාර්ට් කරන්න
    Route::post('/chat/start/{product}', [ChatController::class, 'start'])->name('chat.start');

    // 3. තනි චැට් පේජ් එකක් මැසේජ් ලෝඩ් කරලා පෙන්වන්න
    Route::get('/chat/{conversation}', [ChatController::class, 'show'])->name('chat.show');

    // 4. චැට් එක ඇතුළේ මැසේජ් එකක් යවන්න (POST Request)
    Route::post('/chat/{conversation}/message', [ChatController::class, 'storeMessage'])->name('chat.message.store');
});

// 💡 නිවැරදි කිරීම: වෙනත් කිසිම රූට් එකකට ගැලපුනේ නැත්නම් විතරක් ID එකක් කියලා හිතලා මේකට එනවා
// ප්‍රොඩක්ට් එකේ ID එක අනුව තනි ප්‍රොඩක්ට් එකක විස්තර පෙන්වන පේජ් එක (Public Route)
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

// Default Starter Kit එකෙන් ලැබුණු Settings (Profile, Password) රූට්ස් ටික
require __DIR__.'/settings.php';
