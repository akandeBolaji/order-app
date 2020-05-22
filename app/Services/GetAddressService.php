<?php

namespace App\Services;

use App\Models\Address;

class GetAddressService
{
    public function run($request)
    {

        $address = $this->filterAddress(['address'], $request->search);

        return $address;
    }

    protected function filterAddress($field, $parameter)
    {
        return Address::whereLike($field, $parameter)->orderBy('address', 'asc')->get();
    }

}
