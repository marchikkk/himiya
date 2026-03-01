<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

        $response = Http::withBasicAuth('', '')
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
                | IMAGES (СКАЧИВАЕМ И СОХРАНЯЕМ В STORAGE)
                |--------------------------------------------------------------------------
                */
                $syncedPaths = [];

                $imagesFrom1C = [];
                if (!empty($item['images']) && is_array($item['images'])) {
                    $imagesFrom1C = $item['images'];
                } elseif (!empty($item['image'])) {
                    $imagesFrom1C = [$item['image']];
                }

                foreach ($imagesFrom1C as $index => $url) {
                    // 1. Определяем "родное" имя файла из ссылки (например, fc986626-....jpg)
                    $filename = basename($url); 
                    $path = "products/$filename";

                    // 2. Ищем запись в базе по path (вместо url)
                    $image = $product->images()->where('path', $path)->first();

                    // 3. Проверяем, существует ли физически файл
                    if ($image && Storage::disk('public')->exists($path)) {
                        // Если всё на месте, просто обновляем сортировку
                        $image->update(['sort' => $index]);
                    } else {
                        try {
                            // Если файла нет — качаем
                            $response = Http::timeout(10)->get($url);

                            if ($response->ok()) {
                                Storage::disk('public')->put($path, $response->body());

                                // Обновляем существующую запись или создаем новую
                                $product->images()->updateOrCreate(
                                    ['path' => $path],
                                    ['sort' => $index]
                                );
                            }
                        } catch (\Exception $e) {
                            logger("Image download failed: " . $url . " Error: " . $e->getMessage());
                        }
                    }
                    $syncedPaths[] = $path;
                }

                // 4. Удаляем из базы и с диска всё, чего не было в этом сеансе синхронизации
                $product->images()
                    ->whereNotIn('path', $syncedPaths)
                    ->get()
                    ->each(function ($image) {
                        if ($image->path) {
                            Storage::disk('public')->delete($image->path);
                        }
                        $image->delete();
                    });
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