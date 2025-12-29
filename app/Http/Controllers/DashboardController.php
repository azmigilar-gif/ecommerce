<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // User's statistics
        $userStats = [
            'total_orders' => $user->orders()->count(),
            'total_spent' => $user->orders()->sum('total_amount'),
            'cart_items' => $user->cartItems()->count(),
        ];

        // Recent orders
        $recentOrders = $user->orders()
            ->with('orderItems.product')
            ->latest()
            ->take(5)
            ->get();

        // Low stock products (for all users to see)
        $lowStockProducts = Product::where('stock_quantity', '<=', 10)
            ->where('stock_quantity', '>', 0)
            ->orderBy('stock_quantity', 'asc')
            ->take(5)
            ->get();

        // Today's sales summary (simple stats)
        $todayOrders = Order::whereDate('created_at', today())->count();
        $todayRevenue = Order::whereDate('created_at', today())->sum('total_amount');

        return Inertia::render('Dashboard', [
            'userStats' => $userStats,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
            'todayOrders' => $todayOrders,
            'todayRevenue' => $todayRevenue,
        ]);
    }
}
