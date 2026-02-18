<?php

namespace App\Http\Controllers\Auth;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
        // GET /  (dashboard)
    public function index(Request $request)
    {
        $query = Order::query();

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('fio', 'like', "%{$search}%")
                  ->orWhere('contact', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('car', 'like', "%{$search}%");
            });
        }

        if ($request->from) {
            $query->whereDate('datetime', '>=', $request->from);
        }
        if ($request->to) {
            $query->whereDate('datetime', '<=', $request->to);
        }

        $sort = $request->sort === 'oldest' ? 'asc' : 'desc';
        if ($status = $request->status) {
            if ($status !== 'all') $query->where('status', $status);
        }

        $orders = $query->with('images')->orderBy('datetime', $sort)->get();

        return view('dashboard', compact('orders'));
    }

    public function images()
    {
        return $this->hasMany(OrderImage::class);
    }



    // POST /orders  (создание заявки)
    public function store(Request $r)
    {
        $data = $r->validate([
            'code' => 'required|string|unique:orders,code',
            'fio' => 'required|string',
            'contact' => 'required|string',
            'datetime' => 'required|date',
            'car' => 'required|string',
            'images.*' => 'image|max:4096' // опционально: проверяем каждый файл
        ]);

        // 1) Сначала создаём заказ (без ключа 'images')
        $orderData = $data;
        // на всякий случай убираем images ключ, если он попал в $data
        if (isset($orderData['images'])) {
            unset($orderData['images']);
        }

        $order = Order::create($orderData);

        // 2) Затем сохраняем файлы (если они были загружены) и привязываем к только-что созданному заказу
        if ($r->hasFile('images')) {
            foreach ($r->file('images') as $img) {
                if (!$img->isValid()) continue;

                // сохраняем в storage/app/public/orders
                $path = $img->store('orders', 'public');

                // предполагается, что у модели Order есть relation images() -> hasMany(OrderImage::class)
                $order->images()->create([
                    'path' => $path
                ]);
            }
        }

        return back();
    }

    // PATCH /orders/{order}/status
    public function updateStatus(Order $order, Request $r)
    {
        $r->validate(['status' => 'required|in:new,work,done']);
        $order->update(['status' => $r->status]);
        return response()->json(['ok' => true]);
    }
}
