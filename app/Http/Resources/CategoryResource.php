<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->external_id,
            'name' => $this->name,
            'parent_id' => $this->parent_external_id,
        ];
    }
}

