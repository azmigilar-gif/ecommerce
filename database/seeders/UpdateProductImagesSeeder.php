<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class UpdateProductImagesSeeder extends Seeder
{
    public function run(): void
    {
        // Curated map of official product image URLs. If a product name is
        // present here we'll use the official URL; otherwise fall back to
        // Unsplash source search by product name.
        // You can edit these URLs to point to preferred images (local or CDN).
        // Use the exact URLs provided by the user (no download; hotlinking):
        $manual = [
            // User-provided exact hotlink URLs (no Unsplash, no downloads)
            'AirPods Pro' => 'https://ibox.co.id/_next/image?url=https%3A%2F%2Fcdnpro.eraspace.com%2Fmedia%2Fcatalog%2Fproduct%2Fa%2Fp%2Fapple_airpods_pro_generasi_ke-2_usb-c_1_1.jpg&w=1920&q=45',
            'Laptop Dell XPS 15' => 'https://www.jktgadget.com/wp-content/uploads/2023/07/DELL-XPS-15-9530-1.jpg',
            'iPad Air' => 'https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111887_sp866-ipad-air-5gen.png',
            'Mechanical Keyboard RGB' => 'https://images-cdn.ubuy.co.id/668b1e475575817e194f2b4c-krov-mechanical-gaming-keyboard-rgb.jpg',
        ];

        // Only update products that exist in the manual map. Do NOT fallback
        // to any external search — use exactly the URLs provided.
        foreach ($manual as $name => $url) {
            if (empty($url)) continue;

            Product::where('name', $name)
                ->update(['image' => $url]);
        }
    }
}
