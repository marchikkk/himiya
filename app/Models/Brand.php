<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Brand extends Model
{
    protected $fillable=['name'];
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    protected static function booted() {
        static::creating(function ($brand) {
            $brand->slug = Str::slug($brand->name);
        });
    }
}
