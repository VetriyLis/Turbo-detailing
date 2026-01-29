<?php

namespace App\Http\Controllers\Auth;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // только авторизованные могут работать с заявками
    public function __construct()
    {
        $this->middleware('auth');
    }

    // GET /  (dashboard)
    public function index(Request $request)
    {
        $query = Order::query();

        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('fio', 'like', "%{$search}%")
                  ->orWhere('contact', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
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

        $orders = $query->orderBy('datetime', $sort)->get();

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
        ]);

        Order::create($data);

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
