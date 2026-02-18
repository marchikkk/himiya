<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = [
        'external_id',
        'name',
    ];

    // protected $casts = [
    //     'external_id' => 'string',
    // ];

    public function stocks()
    {
        return $this->hasMany(ProductStock::class);
    }
}

