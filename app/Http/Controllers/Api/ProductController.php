<?php

namespace App\Http\Controllers\Api;

use App\Models\Scopes\InStockScope;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with([
            'category',
            'stocks.warehouse',
            'images',
            'brand'
        ]);

        // КАТЕГОРИЯ 
        if ($category = $request->get('category')) {
            $query->where('category_external_id', $category);
        }

        // В НАЛИЧИИ
        if ($request->boolean('in_stock')) {
            $query->where('stock_total', '>', 0);
        }

        // ЦЕНА
        if ($from = $request->get('price_from')) {
            $query->where('price', '>=', $from);
        }

        if ($to = $request->get('price_to')) {
            $query->where('price', '<=', $to);
        }

        // СКЛАД
        if ($warehouseId = $request->get('warehouse')) {
            $query->whereHas('stocks', function ($q) use ($warehouseId) {
                $q->whereHas('warehouse', function ($w) use ($warehouseId) {
                    $w->where('external_id', $warehouseId);
                })->where('quantity', '>', 0);
            });
        }

        // ПОИСК
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                  ->orWhere('sku', 'ILIKE', "%{$search}%")
                  ->orWhereHas('brand', function ($b) use ($search) {
                    $b->where('name', 'ILIKE', "%{$search}%");
                  });
            });
        }

        // НЕСКОЛЬКО БРЕНДОВ
        $brands = $request->get('brands');
        if (!empty($brands) && $brands !== 'null') {
            $brandsArray = explode(',', $brands);

            $query->whereHas('brand', function ($q) use ($brandsArray) {
                $q->whereIn('slug', $brandsArray);
            });
        }

        // ONLY WITH PROMO
        if ($request->boolean('promo')) {
            $query->where('discount_percent', '>', 0);
        }

        // SORT
        switch ($request->get('sort')) {
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break; 
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;   
            case 'promo_desc':
                $query->orderBy('discount_percent', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
        }
        
        $products = $query->paginate(20);

        /*
        |--------------------------------------------------------------------------
        | Получаем бренды из текущего запроса
        |--------------------------------------------------------------------------
        */
        $brands = $products->getCollection() // Берем коллекцию из пагинатора
            ->pluck('brand')
            ->filter()
            ->unique('id')
            ->values()
            ->map(function ($brand) {
                return [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                ];
            });

        return response()->json([
            'data' => ProductResource::collection($products),
            'brands' => $brands,
            'meta' => [
                'total' => $products->total(),
            ]
        ]);

        
    }

    public function show(string $id)
    {
        $product = Product::withoutGlobalScope(InStockScope::class)
        ->where('is_active', true)
        ->with([
            'category',
            'stocks.warehouse',
            'images',
            'brand'
        ])->where('external_id', $id)->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return new ProductResource($product);
    }
}