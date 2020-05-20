<?php

namespace App\Services;

use App\Models\Address;
use DB;

class GetAddressService
{
    public function run($request)
    {
        DB::transaction(function () use ($request) {});
    }
}
