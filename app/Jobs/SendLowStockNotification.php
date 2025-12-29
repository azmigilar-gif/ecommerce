<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\User;
use App\Mail\LowStockNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendLowStockNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function handle(): void
    {
        Log::channel('low_stock')->info('📧 Processing low stock notification email', [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'current_stock' => $this->product->stock_quantity,
            'timestamp' => now(),
        ]);

        $admin = User::where('email', 'admin@ecommerce.test')->first();

        if ($admin) {
            Mail::to($admin->email)->send(new LowStockNotification($this->product));

            Log::channel('low_stock')->info('✅ Low stock notification email sent to ' . $admin->email, [
                'product_id' => $this->product->id,
                'product_name' => $this->product->name,
                'timestamp' => now(),
            ]);
        } else {
            Log::channel('low_stock')->error('❌ Admin user not found', [
                'timestamp' => now(),
            ]);
        }
    }
}
