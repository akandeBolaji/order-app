<?php

use Illuminate\Database\Seeder;
use App\Models\Address;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Address::create([
            'address' => 'Ojota, Lagos, Nigeria',
            'latitude' => '6.5873161',
            'longitude' => '3.3785711'
        ]);

        Address::create([
            'address' => 'Lekki Phase 1, Lekki, Nigeria',
            'latitude' => '6.4478093',
            'longitude' => '3.4723495'
        ]);

        Address::create([
            'address' => 'Victoria Island, Lagos, Nigeria',
            'latitude' => '6.4290982',
            'longitude' => '3.4238032'
        ]);

        Address::create([
            'address' => 'Yaba, Oworonshoki, Nigeria',
            'latitude' => '6.5095442',
            'longitude' => '3.3710936'
        ]);

        Address::create([
            'address' => 'Lagos Island, Lagos, Nigeria',
            'latitude' => '6.4550805',
            'longitude' => '3.394332'
        ]);

        Address::create([
            'address' => 'Lagos Mainland, Lagos, Nigeria',
            'latitude' => '6.5059002',
            'longitude' => '3.3780722'
        ]);


        Address::create([
            'address' => 'Ikorodu, Nigeria',
            'latitude' => '6.6194131',
            'longitude' => '3.5104537'
        ]);
    }
}
