<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = ['product_id', 'path', 'sort'];
    protected $appends = ['url'];
    
    public function getUrlAttribute() {
        if (!$this->path) {
            return null;
        }
        return asset('storage/' . $this->path);
    }
    public function product() {
        return $this->belongsTo(Product::class);
    }
}
