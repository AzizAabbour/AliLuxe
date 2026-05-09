<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlists = Wishlist::where('user_id', $request->user()->id)
            ->with('product.primaryImage', 'product.category')
            ->latest()
            ->get();

        return response()->json($wishlists);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'wishlisted' => false,
                'message' => 'Removed from wishlist',
            ]);
        }

        Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'wishlisted' => true,
            'message' => 'Added to wishlist',
        ]);
    }

    public function destroy(Wishlist $wishlist)
    {
        $wishlist->delete();

        return response()->json([
            'message' => 'Removed from wishlist',
        ]);
    }
}
