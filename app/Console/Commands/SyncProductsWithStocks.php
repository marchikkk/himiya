<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\ProductStock;
use App\Models\Brand;

class SyncProductsWithStocks extends Command
{
    protected $signature = 'sync:products-full';
    protected $description = 'Sync products, warehouses and stocks from 1C';

    public function handle()
    {
        $this->info('Starting category sync first...');
        $this->call('sync:categories');

        $response = Http::withBasicAuth('Artem', '1111')
            ->get(env('ONEC_API_PRODUCTS'));

        if (!$response->ok()) {
            $this->error('1C API error');
            return Command::FAILURE;
        }

        $data = json_decode(
            trim($response->body(), "\xef\xbb\xbf"),
            true
        );

        if (empty($data['products'])) {
            $this->error('No products received');
            return Command::FAILURE;
        }

        foreach ($data['products'] as $item) {

            DB::transaction(function () use ($item) {

                /*
                |--------------------------------------------------------------------------
                | BRAND
                |--------------------------------------------------------------------------
                */
                $brandId = null;

                if (!empty($item['brand'])) {
                    $brand = Brand::updateOrCreate(
                        ['name' => trim($item['brand'])]
                    );
                    $brandId = $brand->id;
                }

                /*
                |--------------------------------------------------------------------------
                | PRODUCT
                |--------------------------------------------------------------------------
                */
                $product = Product::withoutGlobalScopes()
                ->updateOrCreate(
                    ['external_id' => $item['id']],
                    [
                        'sku' => $item['sku'] ?? $item['id'],
                        'name' => $item['name'],
                        'price' => $item['price'] ?? 0,
                        'discount_percent' => $item['discount_percent'] ?? 0,
                        'category_external_id' => $item['category_id'] ?? null,
                        'brand_id' => $brandId,
                        'is_active' => true,
                    ]
                );

                /*
                |--------------------------------------------------------------------------
                | IMAGES (ПРАВИЛЬНЫЙ SYNC)
                |--------------------------------------------------------------------------
                */
                $newImages = [];

                if (!empty($item['images']) && is_array($item['images'])) {

                    foreach ($item['images'] as $index => $url) {

                        $product->images()->updateOrCreate(
                            [
                                'product_id' => $product->id,
                                'url' => $url
                            ],
                            [
                                'sort' => $index
                            ]
                        );

                        $newImages[] = $url;
                    }

                } elseif (!empty($item['image'])) {

                    $product->images()->updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'url' => $item['image']
                        ],
                        [
                            'sort' => 0
                        ]
                    );

                    $newImages[] = $item['image'];
                }

                // Удаляем только те картинки которых больше нет в 1С
                if (!empty($newImages)) {
                    $product->images()
                        ->whereNotIn('url', $newImages)
                        ->delete();
                }
                /*
                |--------------------------------------------------------------------------
                | STOCKS
                |--------------------------------------------------------------------------
                */
                $totalStock = 0;
                $activeWarehouses = [];

                if (!empty($item['stocks'])) {

                    foreach ($item['stocks'] as $stock) {

                        $warehouse = Warehouse::firstOrCreate(
                            ['external_id' => $stock['id']],
                            ['name' => $stock['name']]
                        );

                        ProductStock::updateOrCreate(
                            [
                                'product_id' => $product->id,
                                'warehouse_id' => $warehouse->id,
                            ],
                            [
                                'quantity' => (int) $stock['quantity'],
                            ]
                        );

                        $totalStock += (int) $stock['quantity'];
                        $activeWarehouses[] = $warehouse->id;
                    }
                }

                // Удаляем склады которых больше нет
                if (!empty($activeWarehouses)) {
                    ProductStock::where('product_id', $product->id)
                        ->whereNotIn('warehouse_id', $activeWarehouses)
                        ->delete();
                }

                /*
                |--------------------------------------------------------------------------
                | UPDATE TOTAL STOCK
                |--------------------------------------------------------------------------
                */
                $product->update([
                    'stock_total' => $totalStock,
                ]);

            });

        }

        $this->info('Products, brands, warehouses and stocks synced successfully');

        return Command::SUCCESS;
    }
}