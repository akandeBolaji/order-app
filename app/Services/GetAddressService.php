<?php

namespace App\Services;

use App\Models\Address;
use DB;

class GetAddressService
{
    public function run($request)
    {
        $distance = $this->filterDistance($request->lat, $request->long);
        $address = $this->filterName($distance, ['address'], $request->search);

        return $address;
    }

    protected function filterName($address, $field, $parameter)
    {
        return $address->whereLike($field, $parameter)->orderBy('address', 'asc')->get();
    }

    protected function filterDistance($latitude, $longitude)
    {
        $address = Address::select(['*', DB::raw('( 0.621371 * 3959 * acos( cos( radians('.$latitude.') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians('.$longitude.') ) + sin( radians('.$latitude.') ) * sin( radians(latitude) ) ) ) AS distance')])->havingRaw('distance < 500');
        return $address;
    }

}
