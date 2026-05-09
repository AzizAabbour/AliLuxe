<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product.primaryImage')
            ->latest()
            ->paginate(10);
        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $order->load('items.product.primaryImage', 'payment');
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_first_name' => 'required|string|max:255',
            'shipping_last_name' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:255',
            'shipping_postal_code' => 'required|string|max:20',
            'shipping_phone' => 'required|string|max:20',
            'payment_method' => 'string|in:card,paypal,cod',
        ]);

        $cart = Cart::where('user_id', $request->user()->id)->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty'], 422);
        }

        foreach ($cart->items as $item) {
            if ($item->quantity > $item->product->stock) {
                return response()->json([
                    'message' => "Not enough stock for {$item->product->name}.",
                ], 422);
            }
        }

        return DB::transaction(function () use ($request, $cart) {
            $subtotal = $cart->items->sum(fn($item) => $item->product->price * $item->quantity);
            $shipping = $subtotal > 500 ? 0 : 25.00;
            $tax = $subtotal * 0.20;
            $total = $subtotal + $shipping + $tax;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'subtotal' => $subtotal,
                'shipping_cost' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'notes' => $request->notes,
                'shipping_first_name' => $request->shipping_first_name,
                'shipping_last_name' => $request->shipping_last_name,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_state' => $request->shipping_state,
                'shipping_postal_code' => $request->shipping_postal_code,
                'shipping_country' => $request->shipping_country ?? 'Morocco',
                'shipping_phone' => $request->shipping_phone,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'total' => $item->product->price * $item->quantity,
                ]);
                $item->product->decrement('stock', $item->quantity);
                $item->product->increment('sales_count', $item->quantity);
            }

            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $request->payment_method ?? 'card',
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'amount' => $total,
                'status' => 'completed',
            ]);

            $cart->items()->delete();

            return response()->json([
                'order' => $order->load('items', 'payment'),
                'message' => 'Order placed successfully!',
            ], 201);
        });
    }

    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'items']);
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        return response()->json($query->latest()->paginate(15));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,processing,shipped,delivered,cancelled']);
        $order->update(['status' => $request->status]);
        return response()->json([
            'order' => $order->load('items', 'payment', 'user'),
            'message' => 'Order status updated',
        ]);
    }
}
