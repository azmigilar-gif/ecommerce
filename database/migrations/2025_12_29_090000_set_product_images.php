<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Populate the `image` column for existing products with a generic image
        // source using the product name as a query so the image roughly matches
        // the product. This stores an external URL (Unsplash source) in the DB.

        // Only populate when `image` is null or empty to avoid overwriting
        // urls that may have been set by seeders or admin actions.
        $products = DB::table('products')
            ->whereNull('image')
            ->orWhere('image', '')
            ->get();

        foreach ($products as $product) {
            $query = rawurlencode($product->name);
            $url = "https://source.unsplash.com/800x600/?{$query}";

            DB::table('products')
                ->where('id', $product->id)
                ->update(['image' => $url]);
        }
    }

    public function down(): void
    {
        // Revert images to null (best-effort rollback)
        DB::table('products')->update(['image' => null]);
    }
};
