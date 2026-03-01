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

            'images' => $this->images->map(function ($img) {
                return url('/media/' . basename($img->path));
            })->values(),

            'category' => $this->category ? [
                    'id' => $this->category->external_id,
                    'name' => $this->category->name,
                ] : null,

            'stocks' => $this->stocks
                ? $this->stocks->map(function ($stock) use ($request) {

                    if ($warehouseId = $request->get('warehouse')) {
                        if ($stock->warehouse?->external_id !== $warehouseId) {
                            return null;
                        }
                    }

                    return [
                        'warehouse_id' => $stock->warehouse?->external_id,
                        'warehouse_name' => $stock->warehouse?->name,
                        'quantity' => (int) $stock->quantity,
                    ];
                })->filter()->values()
                : [],

            'brand' => $this->brand ? [
                    'id' => $this->brand->id,
                    'name' => $this->brand->name,
                ] : null,
        ];
    }
}