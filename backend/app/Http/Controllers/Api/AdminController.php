<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalUsers = User::where('role', 'client')->count();

        $recentOrders = Order::with('user')
            ->latest()
            ->limit(5)
            ->get();

        $lowStockProducts = Product::where('stock', '<', 10)
            ->where('stock', '>', 0)
            ->limit(5)
            ->get();

        $monthlySales = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $bestSellers = Product::orderBy('sales_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_users' => $totalUsers,
            ],
            'recent_orders' => $recentOrders,
            'low_stock' => $lowStockProducts,
            'monthly_sales' => $monthlySales,
            'best_sellers' => $bestSellers,
        ]);
    }

    public function users(Request $request)
    {
        $query = User::where('role', 'client');

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'status' => 'sometimes|in:active,suspended',
        ]);

        $user->update($request->only(['name', 'email', 'status']));

        return response()->json(['user' => $user, 'message' => 'User updated']);
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
