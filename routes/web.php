<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('static/home');
});

Route::get('/shops', function () {
    return view('static/shops');
});

Route::get('/favorites', function () {
    return view('static/favorites');
});

Route::get('/checkout', function () {
    return view('static/checkout');
});

Route::get('/category', function () {
    return view('static/category');
})->name('category');

Route::get('/product', function () {
    return view('static/product');
})->name('product');

Route::get('/search', function () {
    return view('static/search');
});

Route::get('/media/{filename}', function ($filename) {
    $path = storage_path('app/public/products/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});