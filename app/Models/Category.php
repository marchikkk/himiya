<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'external_id',
        'name',
        'parent_external_id'
    ];
    
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_external_id', 'external_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_external_id', 'external_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_external_id', 'external_id');
    }

    
}

