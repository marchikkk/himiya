<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->external_id,
            'sku'         => $this->sku,
            'name'        => $this->name,
            'price'       => (float) $this->price,
            'stock_total' => (int) $this->stock_total,

            // ТОЛЬКО одно изображение
            'image' => $this->images->first()?->url,

            'brand' => $this->brand ? [
                'id'   => $this->brand->id,
                'name' => $this->brand->name,
            ] : null,
        ];
    }
}