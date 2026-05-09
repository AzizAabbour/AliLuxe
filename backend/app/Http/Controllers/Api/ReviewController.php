<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $existing = Review::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already reviewed this product'], 422);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Update product rating
        $product = $review->product;
        $product->reviews_count = $product->reviews()->count();
        $product->rating = $product->reviews()->avg('rating');
        $product->save();

        return response()->json([
            'review' => $review->load('user'),
            'message' => 'Review added successfully',
        ], 201);
    }
}
