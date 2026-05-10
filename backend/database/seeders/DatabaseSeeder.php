<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\Review;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@luxestore.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone' => '+212777996998',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create test client
        $client = User::create([
            'name' => 'John Doe',
            'email' => 'client@luxestore.com',
            'password' => bcrypt('password'),
            'role' => 'client',
            'phone' => '+212611111111',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create more clients
        $clients = [];
        $clientNames = [
            'Sarah Wilson', 'Michael Brown', 'Emma Davis',
            'James Johnson', 'Olivia Martinez', 'William Anderson',
            'Sophia Taylor', 'Benjamin Thomas', 'Isabella Garcia',
        ];
        foreach ($clientNames as $name) {
            $clients[] = User::create([
                'name' => $name,
                'email' => Str::slug($name) . '@example.com',
                'password' => bcrypt('password'),
                'role' => 'client',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
        }

        // Categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Latest gadgets and electronic devices', 'sort_order' => 1],
            ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Trendy clothing and accessories', 'sort_order' => 2],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'description' => 'Beautiful home decor and furniture', 'sort_order' => 3],
            ['name' => 'Sports & Outdoor', 'slug' => 'sports-outdoor', 'description' => 'Equipment for an active lifestyle', 'sort_order' => 4],
            ['name' => 'Beauty & Care', 'slug' => 'beauty-care', 'description' => 'Premium beauty and personal care products', 'sort_order' => 5],
            ['name' => 'Books & Media', 'slug' => 'books-media', 'description' => 'Books, music, and entertainment', 'sort_order' => 6],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Products
        $products = [
            // Electronics
            ['category_id' => 1, 'name' => 'Wireless Noise-Cancelling Headphones', 'price' => 299.99, 'compare_price' => 399.99, 'stock' => 45, 'is_featured' => true, 'description' => 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.', 'short_description' => 'Premium ANC headphones with 30hr battery'],
            ['category_id' => 1, 'name' => 'Ultra-Slim Laptop Pro 15"', 'price' => 1299.99, 'compare_price' => 1499.99, 'stock' => 20, 'is_featured' => true, 'description' => 'Powerful ultra-slim laptop with M3 chip, 16GB RAM, 512GB SSD, and stunning Retina display. Built for professionals and creatives.', 'short_description' => 'M3 chip, 16GB RAM, 512GB SSD laptop'],
            ['category_id' => 1, 'name' => 'Smart Watch Series X', 'price' => 449.99, 'compare_price' => 499.99, 'stock' => 60, 'is_featured' => true, 'description' => 'Advanced smartwatch with health monitoring, GPS, always-on display, and water resistance up to 50 meters.', 'short_description' => 'Health monitoring smartwatch with GPS'],
            ['category_id' => 1, 'name' => '4K Wireless Earbuds', 'price' => 179.99, 'compare_price' => 229.99, 'stock' => 100, 'is_featured' => false, 'description' => 'True wireless earbuds with spatial audio, adaptive transparency, and up to 6 hours of listening time.', 'short_description' => 'Spatial audio true wireless earbuds'],
            ['category_id' => 1, 'name' => 'Portable Bluetooth Speaker', 'price' => 89.99, 'compare_price' => null, 'stock' => 75, 'is_featured' => false, 'description' => 'Waterproof portable speaker with 360° sound, 12-hour battery, and deep bass.', 'short_description' => 'Waterproof 360° sound speaker'],

            // Fashion
            ['category_id' => 2, 'name' => 'Premium Leather Jacket', 'price' => 399.99, 'compare_price' => 549.99, 'stock' => 15, 'is_featured' => true, 'description' => 'Handcrafted genuine leather jacket with a modern slim fit. Timeless style meets contemporary design.', 'short_description' => 'Genuine leather, modern slim fit'],
            ['category_id' => 2, 'name' => 'Classic Denim Collection', 'price' => 129.99, 'compare_price' => 159.99, 'stock' => 50, 'is_featured' => false, 'description' => 'Premium selvedge denim jeans crafted with Japanese fabric. Comfortable fit with a classic straight leg silhouette.', 'short_description' => 'Japanese selvedge denim jeans'],
            ['category_id' => 2, 'name' => 'Minimalist Leather Watch', 'price' => 249.99, 'compare_price' => 299.99, 'stock' => 30, 'is_featured' => true, 'description' => 'Elegant minimalist watch with genuine leather strap, sapphire crystal, and Swiss movement.', 'short_description' => 'Swiss movement minimalist watch'],
            ['category_id' => 2, 'name' => 'Designer Sunglasses', 'price' => 189.99, 'compare_price' => null, 'stock' => 40, 'is_featured' => false, 'description' => 'UV400 polarized lenses with titanium frame. Lightweight and durable for everyday luxury.', 'short_description' => 'Polarized titanium frame sunglasses'],
            ['category_id' => 2, 'name' => 'Cashmere Wool Scarf', 'price' => 99.99, 'compare_price' => 139.99, 'stock' => 25, 'is_featured' => false, 'description' => 'Luxuriously soft 100% cashmere scarf. Perfect for adding elegance to any outfit.', 'short_description' => '100% cashmere luxury scarf'],

            // Home & Living
            ['category_id' => 3, 'name' => 'Scandinavian Floor Lamp', 'price' => 199.99, 'compare_price' => 259.99, 'stock' => 20, 'is_featured' => true, 'description' => 'Modern Scandinavian design floor lamp with adjustable brightness and warm LED lighting.', 'short_description' => 'Adjustable modern floor lamp'],
            ['category_id' => 3, 'name' => 'Handwoven Cotton Throw', 'price' => 79.99, 'compare_price' => null, 'stock' => 35, 'is_featured' => false, 'description' => 'Artisan handwoven cotton throw blanket with geometric patterns. Adds warmth and style.', 'short_description' => 'Artisan handwoven throw blanket'],
            ['category_id' => 3, 'name' => 'Ceramic Vase Set', 'price' => 59.99, 'compare_price' => 79.99, 'stock' => 40, 'is_featured' => false, 'description' => 'Set of 3 minimalist ceramic vases in matte finish. Perfect for fresh or dried flower arrangements.', 'short_description' => 'Set of 3 minimalist ceramic vases'],
            ['category_id' => 3, 'name' => 'Smart Home Hub', 'price' => 149.99, 'compare_price' => 179.99, 'stock' => 55, 'is_featured' => true, 'description' => 'Central smart home controller with voice assistant, compatible with 500+ devices.', 'short_description' => 'Voice-controlled smart home hub'],

            // Sports & Outdoor
            ['category_id' => 4, 'name' => 'Carbon Fiber Running Shoes', 'price' => 219.99, 'compare_price' => 279.99, 'stock' => 45, 'is_featured' => true, 'description' => 'Ultra-light carbon fiber plate running shoes designed for maximum energy return and comfort.', 'short_description' => 'Carbon plate performance running shoes'],
            ['category_id' => 4, 'name' => 'Yoga Mat Premium', 'price' => 69.99, 'compare_price' => null, 'stock' => 80, 'is_featured' => false, 'description' => 'Extra-thick eco-friendly yoga mat with alignment markers and non-slip surface.', 'short_description' => 'Eco-friendly non-slip yoga mat'],
            ['category_id' => 4, 'name' => 'Hiking Backpack 40L', 'price' => 159.99, 'compare_price' => 199.99, 'stock' => 25, 'is_featured' => false, 'description' => 'Durable 40L hiking backpack with rain cover, hydration system, and ergonomic support.', 'short_description' => '40L durable hiking backpack'],

            // Beauty & Care
            ['category_id' => 5, 'name' => 'Luxury Skincare Set', 'price' => 189.99, 'compare_price' => 249.99, 'stock' => 30, 'is_featured' => true, 'description' => 'Complete luxury skincare routine with cleanser, serum, moisturizer, and eye cream. Made with natural ingredients.', 'short_description' => 'Complete natural skincare routine'],
            ['category_id' => 5, 'name' => 'Organic Essential Oils Kit', 'price' => 49.99, 'compare_price' => null, 'stock' => 60, 'is_featured' => false, 'description' => 'Set of 6 pure organic essential oils for aromatherapy and wellness.', 'short_description' => '6-piece organic essential oils set'],
            ['category_id' => 5, 'name' => 'Premium Hair Care Bundle', 'price' => 79.99, 'compare_price' => 109.99, 'stock' => 40, 'is_featured' => false, 'description' => 'Professional-grade shampoo, conditioner, and hair mask for all hair types.', 'short_description' => 'Pro-grade hair care trio'],

            // Books & Media
            ['category_id' => 6, 'name' => 'The Art of Minimalism', 'price' => 24.99, 'compare_price' => null, 'stock' => 100, 'is_featured' => false, 'description' => 'A beautifully illustrated guide to living with less and finding more joy in simplicity.', 'short_description' => 'Illustrated minimalism guide'],
            ['category_id' => 6, 'name' => 'Vinyl Record Player', 'price' => 299.99, 'compare_price' => 349.99, 'stock' => 15, 'is_featured' => true, 'description' => 'Vintage-inspired turntable with built-in speakers, Bluetooth connectivity, and premium cartridge.', 'short_description' => 'Bluetooth vintage turntable'],
        ];

        foreach ($products as $p) {
            $product = Product::create(array_merge($p, [
                'slug' => Str::slug($p['name']),
                'sku' => 'SKU-' . strtoupper(Str::random(8)),
                'rating' => rand(35, 50) / 10,
                'reviews_count' => rand(5, 50),
                'sales_count' => rand(10, 200),
            ]));

            // Create placeholder images (using picsum for demo)
            for ($i = 0; $i < 3; $i++) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => 'https://picsum.photos/seed/' . $product->slug . '-' . $i . '/800/800',
                    'is_primary' => $i === 0,
                    'sort_order' => $i,
                ]);
            }
        }

        // Create some reviews
        $allProducts = Product::all();
        $allClients = User::where('role', 'client')->get();
        $comments = [
            'Absolutely love this product! Exceeded my expectations.',
            'Great quality for the price. Would recommend.',
            'Very happy with my purchase. Fast shipping too.',
            'Good product, but packaging could be better.',
            'Excellent quality! Will buy again.',
        ];

        foreach ($allProducts->take(10) as $product) {
            foreach ($allClients->random(3) as $user) {
                Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => rand(3, 5),
                    'comment' => $comments[array_rand($comments)],
                ]);
            }
        }

        // Create some orders
        $statuses = ['pending', 'processing', 'shipped', 'delivered'];
        foreach ($allClients->take(5) as $user) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                $orderProducts = $allProducts->random(rand(1, 4));
                $subtotal = 0;
                $items = [];
                foreach ($orderProducts as $p) {
                    $qty = rand(1, 3);
                    $total = $p->price * $qty;
                    $subtotal += $total;
                    $items[] = [
                        'product_id' => $p->id,
                        'product_name' => $p->name,
                        'price' => $p->price,
                        'quantity' => $qty,
                        'total' => $total,
                    ];
                }
                $shipping = $subtotal > 500 ? 0 : 25;
                $tax = $subtotal * 0.20;

                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'status' => $statuses[array_rand($statuses)],
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shipping,
                    'tax' => $tax,
                    'total' => $subtotal + $shipping + $tax,
                    'shipping_first_name' => explode(' ', $user->name)[0],
                    'shipping_last_name' => explode(' ', $user->name)[1] ?? 'Doe',
                    'shipping_address' => '123 Main Street',
                    'shipping_city' => 'Casablanca',
                    'shipping_postal_code' => '20000',
                    'shipping_phone' => '+212600000000',
                    'created_at' => now()->subDays(rand(1, 60)),
                ]);

                foreach ($items as $item) {
                    OrderItem::create(array_merge($item, ['order_id' => $order->id]));
                }

                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => 'card',
                    'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                    'amount' => $order->total,
                    'status' => 'completed',
                ]);
            }
        }
    }
}
