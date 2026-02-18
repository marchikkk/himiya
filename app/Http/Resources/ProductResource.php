<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->external_id,
            'sku'=> $this->sku,
            'name' => $this->name,

            'price' => (float) $this->price,
            'final_price' => $this->final_price,
            'discount_percent' => (int) $this->discount_percent,

            'stock_total' => (int) $this->stock_total,

            'images' => $this->whenLoaded(
                'images',
                fn () => $this->images->pluck('url')->values()
            ),

            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->external_id,
                    'name' => $this->category->name,
                ];
            }),

            'stocks' => $this->whenLoaded('stocks', function () use ($request) {
                $stocks = $this->stocks;

                if ($warehouseId = $request->get('warehouse')) {
                    $stocks = $stocks->filter(
                        fn ($stock) => $stock->warehouse->external_id === $warehouseId
                    );
                }

                return $stocks->map(function ($stock) {
                    return [
                        'warehouse_id' => $stock->warehouse?->external_id,
                        'warehouse_name' => $stock->warehouse?->name,
                        'quantity' => (int) $stock->quantity,
                    ];
                })->values();
            }),

            'brand' => $this->whenLoaded('brand', function () {
                return [
                    'id' => $this->brand->id,
                    'name' => $this->brand->name,
                ];
            }),
        ];
    }
}