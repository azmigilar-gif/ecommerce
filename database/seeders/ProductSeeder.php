<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop Dell XPS 15',
                'description' => 'High-performance laptop with Intel i7 processor',
                'price' => 1299.99,
                'stock_quantity' => 15,
            ],
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Latest iPhone with A17 Pro chip',
                'price' => 999.99,
                'stock_quantity' => 8,
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Noise-cancelling wireless headphones',
                'price' => 349.99,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Samsung 4K Monitor',
                'description' => '27-inch 4K UHD monitor',
                'price' => 449.99,
                'stock_quantity' => 5, // Low stock
            ],
            [
                'name' => 'Logitech MX Master 3',
                'description' => 'Wireless ergonomic mouse',
                'price' => 99.99,
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Mechanical Keyboard RGB',
                'description' => 'Gaming keyboard with RGB lighting',
                'price' => 129.99,
                'stock_quantity' => 3, // Low stock
            ],
            [
                'name' => 'iPad Air',
                'description' => 'Lightweight tablet with M1 chip',
                'price' => 599.99,
                'stock_quantity' => 12,
            ],
            [
                'name' => 'AirPods Pro',
                'description' => 'Wireless earbuds with active noise cancellation',
                'price' => 249.99,
                'stock_quantity' => 30,
            ],
        ];

        foreach ($products as $product) {
            // Create an Unsplash source URL based on product name so the image
            // roughly matches the product. Uses URL-encoded product name.
            $product['image'] = 'https://source.unsplash.com/800x600/?' . rawurlencode($product['name']);

            Product::create($product);
        }
    }
}
