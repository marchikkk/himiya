<?php

namespace App\Models;

use App\Models\Scopes\InStockScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected static function booted() {
        static::addGlobalScope(new InStockScope);
    }

    protected $fillable = [
        'external_id',
        'sku',
        'name',
        'price',
        'discount_percent',
        'category_external_id',
        'stock_total',
        'brand_id',
        'is_active',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_external_id', 'external_id');
    }

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    } 

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function getFinalPriceAttribute(): float
    {
        if ($this->discount_percent > 0) {
            return round(
                $this->price * (100 - $this->discount_percent)/100,
                2
            );
        }
        return (float) $this->price;
    }
}

