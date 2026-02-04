<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\OrderController;

Route::get('/', [OrderController::class, 'index'])->name('dashboard');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);


