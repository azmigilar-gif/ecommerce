<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Jobs\SendLowStockNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Auth::user()->cartItems()->with('product')->get();

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'total' => $total
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);

            $product = Product::findOrFail($request->product_id);

            // Check stock availability
            if ($product->stock_quantity < $request->quantity) {
                return response()->json([
                    'message' => 'Insufficient stock available'
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Deduct stock from product immediately
                $product->decrement('stock_quantity', $request->quantity);
                $product->refresh();

                // Check if item already exists in cart
                $existingCartItem = CartItem::where('user_id', Auth::id())
                    ->where('product_id', $request->product_id)
                    ->first();

                if ($existingCartItem) {
                    // Update existing cart item
                    $newQuantity = $existingCartItem->quantity + $request->quantity;
                    $existingCartItem->update(['quantity' => $newQuantity]);
                    $cartItem = $existingCartItem->fresh(['product']);
                } else {
                    // Create new cart item
                    $cartItem = CartItem::create([
                        'user_id' => Auth::id(),
                        'product_id' => $request->product_id,
                        'quantity' => $request->quantity
                    ]);
                    $cartItem->load('product');
                }

                // Check if stock is low after deduction
                if ($product->stock_quantity <= 10 && $product->stock_quantity >= 0) {
                    SendLowStockNotification::dispatch($product);
                }

                DB::commit();

                return response()->json([
                    'message' => 'Product added to cart',
                    'cartItem' => $cartItem
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                // Restore stock if error
                $product->increment('stock_quantity', $request->quantity);
                throw $e;
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, CartItem $cartItem)
    {
        // Ensure user owns this cart item
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $product = $cartItem->product;
        $quantityDifference = $request->quantity - $cartItem->quantity;

        // If quantity increased, check if enough stock to add
        if ($quantityDifference > 0) {
            if ($product->stock_quantity < $quantityDifference) {
                return response()->json([
                    'message' => 'Insufficient stock available'
                ], 400);
            }
            // Deduct additional stock
            $product->decrement('stock_quantity', $quantityDifference);
        } 
        // If quantity decreased, restore the stock
        elseif ($quantityDifference < 0) {
            $product->increment('stock_quantity', abs($quantityDifference));
        }

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Cart updated',
            'cartItem' => $cartItem->load('product')
        ]);
    }

    public function destroy(CartItem $cartItem)
    {
        // Ensure user owns this cart item
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Restore stock when item removed from cart
        $cartItem->product->increment('stock_quantity', $cartItem->quantity);

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart'
        ]);
    }

    public function count()
    {
        $count = Auth::user()->cartItems()->sum('quantity');

        return response()->json(['count' => $count]);
    }
}
