<?php

namespace App\Http\Controllers\Api;

use App\Models\Warehouse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\WarehouseResource;

class WarehouseController extends Controller
{
    public function index()
{

    $warehouses = Warehouse::all();

    return WarehouseResource::collection($warehouses);
}
}
