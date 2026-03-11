<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\Controller;
use App\Models\Order;
use App\Models\OrderImage;
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

    // POST /orders  (создание заявки)
    public function store(Request $r)
    {
        $data = $r->validate([
            'code' => 'required|string|unique:orders,code',
            'fio' => 'required|string',
            'contact' => 'required|string',
            'datetime' => 'required|date',
            'car' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'image'
        ]);

        $orderData = $data;
        if (isset($orderData['images'])) {
            unset($orderData['images']);
        }

        $order = Order::create($orderData);

        if ($r->hasFile('images')) {
            $files = $r->file('images');
            if (!is_array($files)) {
                $files = [$files];
            }
            foreach ($files as $img) {
                if (!$img || !$img->isValid()) continue;
                $path = $img->store('orders', 'public'); // сохранит в storage/app/public/orders
                $order->images()->create(['path' => $path]);
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