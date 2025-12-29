<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Jobs\SendLowStockNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();

        try {
            // Calculate total
            $totalAmount = 0;

            foreach ($cartItems as $cartItem) {
                $totalAmount += $cartItem->quantity * $cartItem->product->price;
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => 'completed'
            ]);

            // Create order items (stock already deducted when added to cart)
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price
                ]);

                // Check if stock is low after sale
                if ($cartItem->product->stock_quantity <= 10) {
                    Log::channel('low_stock')->warning('⚠️ LOW STOCK ALERT', [
                        'product_id' => $cartItem->product->id,
                        'product_name' => $cartItem->product->name,
                        'current_stock' => $cartItem->product->stock_quantity,
                        'order_id' => $order->id,
                        'timestamp' => now(),
                    ]);
                    SendLowStockNotification::dispatch($cartItem->product);
                }
            }

            // Clear cart
            CartItem::where('user_id', $user->id)->delete();

            DB::commit();

            // Dispatch daily sales report job (will be scheduled)
            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'redirect' => route('orders.success', $order->id)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function success(Order $order)
    {
        // Verify user owns this order
        if ($order->user_id !== Auth::id()) {
            return redirect()->route('products.index');
        }

        return Inertia::render('Orders/Success', [
            'order' => $order->load('orderItems.product')
        ]);
    }
}
