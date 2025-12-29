<?php

namespace App\Http\Controllers;

use App\Jobs\SendDailySalesReport;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __construct()
    {
        // Middleware to check if user is admin (optional - can be added to middleware)
    }

    public function index()
    {
        // Get today's sales stats
        $todayOrders = Order::whereDate('created_at', now()->toDateString())->count();
        $todaySales = Order::whereDate('created_at', now()->toDateString())->sum('total_amount');
        $totalOrders = Order::count();
        $totalRevenue = Order::sum('total_amount');

        return Inertia::render('Admin/Dashboard', [
            'todayOrders' => $todayOrders,
            'todaySales' => $todaySales,
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
        ]);
    }

    public function sendDailyReport(Request $request)
    {
        try {
            // Get report data
            $todayOrders = Order::whereDate('created_at', now()->toDateString())->count();
            $todaySales = Order::whereDate('created_at', now()->toDateString())->sum('total_amount');
            $totalOrders = Order::count();
            $totalRevenue = Order::sum('total_amount');

            $reportData = [
                'todayOrders' => $todayOrders,
                'todaySales' => $todaySales,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
            ];

            // Log dispatch action
            Log::channel('daily_reports')->info('=== DAILY REPORT TRIGGERED FROM ADMIN DASHBOARD ===', [
                'timestamp' => now(),
                'triggered_by' => Auth::user()->email,
                'report_data' => $reportData,
            ]);

            // Dispatch the daily sales report job immediately
            SendDailySalesReport::dispatch();

            return response()->json([
                'success' => true,
                'message' => 'Daily sales report has been sent to admin email and logged.'
            ]);
        } catch (\Exception $e) {
            Log::channel('daily_reports')->error('Error sending daily report', [
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
