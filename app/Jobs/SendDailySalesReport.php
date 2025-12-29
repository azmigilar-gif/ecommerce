<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\User;
use App\Mail\DailySalesReport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $today = now()->toDateString();

        $orders = Order::whereDate('created_at', $today)
            ->with('orderItems.product')
            ->get();

        $totalSales = $orders->sum('total_amount');
        $totalOrders = $orders->count();

        $admin = User::where('email', 'admin@ecommerce.test')->first();

        if ($admin) {
            $reportData = [
                'orders' => $orders,
                'totalSales' => $totalSales,
                'totalOrders' => $totalOrders,
            ];

            Mail::to($admin->email)->send(new DailySalesReport($reportData));
        }
    }
}

