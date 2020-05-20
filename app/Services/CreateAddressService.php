<?php

namespace App\Services;

use App\Models\Address;
use DB;

class CreateAddressService
{
    public function run($request)
    {
        DB::transaction(function () use ($request) {

            $address = Address::create([
                'address' => $request->address,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude
            ]);
            return $address;
        });
    }
}
