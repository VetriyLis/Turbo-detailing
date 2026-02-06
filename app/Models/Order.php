<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'fio',
        'contact',
        'status',
        'datetime',
        'car',
        'path'
    ];

    protected $casts = [
        'datetime' => 'datetime',
    ];
}
