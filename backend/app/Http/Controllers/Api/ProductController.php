<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * List products with filters and pagination
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'primaryImage', 'images']);

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Category filter
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('category_slug') && $request->category_slug) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category_slug);
            });
        }

        // Price filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Stock filter
        if ($request->has('in_stock') && $request->in_stock) {
            $query->where('stock', '>', 0);
        }

        // Featured filter
        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        // Active only (for public)
        if (!$request->has('include_inactive')) {
            $query->where('is_active', true);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        switch ($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'popular':
                $query->orderBy('sales_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            default:
                $query->orderBy($sortBy, $sortDir);
        }

        $perPage = $request->get('per_page', 12);

        return response()->json($query->paginate($perPage));
    }

    /**
     * Show single product
     */
    public function show($slug)
    {
        $product = Product::with(['category', 'images', 'reviews.user'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        // Get related products
        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->active()
            ->with(['primaryImage'])
            ->limit(4)
            ->get();

        return response()->json([
            'product' => $product,
            'related' => $related,
        ]);
    }

    /**
     * Store a new product (Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images.*' => 'image|max:5120',
        ]);

        $product = Product::create($request->except('images'));

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        return response()->json([
            'product' => $product->load(['images', 'category']),
            'message' => 'Product created successfully',
        ], 201);
    }

    /**
     * Update product (Admin)
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'sometimes|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'sometimes|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images.*' => 'image|max:5120',
        ]);

        if ($request->has('name') && $request->name !== $product->name) {
            $request->merge(['slug' => Str::slug($request->name)]);
        }

        $product->update($request->except('images'));

        // Handle new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => false,
                    'sort_order' => $product->images()->count() + $index,
                ]);
            }
        }

        return response()->json([
            'product' => $product->load(['images', 'category']),
            'message' => 'Product updated successfully',
        ]);
    }

    /**
     * Delete product (Admin)
     */
    public function destroy(Product $product)
    {
        // Delete images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Delete a product image (Admin)
     */
    public function deleteImage(ProductImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json([
            'message' => 'Image deleted successfully',
        ]);
    }

    /**
     * Get featured products
     */
    public function featured()
    {
        $products = Product::with(['primaryImage', 'category'])
            ->active()
            ->featured()
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}
