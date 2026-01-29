<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/main', function () {
    return view('main');
});

Route::get('/', function () {
    return view('log');
});

Route::get('/reg',function () {
    return view('reg');
});


Route::post('/reg', function () {
    return view('reg');
});