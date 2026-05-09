<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Get current user's cart
     */
    public function index(Request $request)
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cart->load('items.product.primaryImage');

        return response()->json([
            'cart' => $cart,
            'items' => $cart->items,
            'total' => $cart->total,
            'items_count' => $cart->items_count,
        ]);
    }

    /**
     * Add item to cart
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1|max:99',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock < ($request->quantity ?? 1)) {
            return response()->json([
                'message' => 'Not enough stock available',
            ], 422);
        }

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $newQty = $cartItem->quantity + ($request->quantity ?? 1);
            if ($newQty > $product->stock) {
                return response()->json([
                    'message' => 'Cannot add more than available stock',
                ], 422);
            }
            $cartItem->update(['quantity' => $newQty]);
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity ?? 1,
            ]);
        }

        $cart->load('items.product.primaryImage');

        return response()->json([
            'cart' => $cart,
            'items' => $cart->items,
            'total' => $cart->total,
            'items_count' => $cart->items_count,
            'message' => 'Item added to cart',
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        if ($request->quantity > $cartItem->product->stock) {
            return response()->json([
                'message' => 'Not enough stock available',
            ], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        $cart = $cartItem->cart->load('items.product.primaryImage');

        return response()->json([
            'cart' => $cart,
            'items' => $cart->items,
            'total' => $cart->total,
            'items_count' => $cart->items_count,
        ]);
    }

    /**
     * Remove item from cart
     */
    public function removeItem(CartItem $cartItem)
    {
        $cart = $cartItem->cart;
        $cartItem->delete();

        $cart->load('items.product.primaryImage');

        return response()->json([
            'cart' => $cart,
            'items' => $cart->items,
            'total' => $cart->total,
            'items_count' => $cart->items_count,
            'message' => 'Item removed from cart',
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();
        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json([
            'message' => 'Cart cleared',
        ]);
    }
}
