<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GetAddressService;
use App\Services\CreateAddressService;
use App\Http\Requests\CreateAddressRequest;
use App\Http\Requests\GetAddressRequest;

class AddressController extends Controller
{
    public function getAddress(GetAddressRequest $request)
    {
        $results = (new GetAddressService())->run($request);
        return response()->json(['error' => false, 'results' => $results]);
    }

    public function saveAddress()
    {

    }
}
