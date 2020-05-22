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
            'address' => 'Ketu, Lagos',
            'latitude' => '5.628262',
            'longitude' => '4.6278292'
        ]);

        Address::create([
            'address' => 'Ojoto, Abuja',
            'latitude' => '5.628262',
            'longitude' => '4.6278292'
        ]);

        Address::create([
            'address' => 'Kanu',
            'latitude' => '5.628262',
            'longitude' => '4.6278292'
        ]);

        Address::create([
            'address' => 'Anambra',
            'latitude' => '5.628262',
            'longitude' => '4.6278292'
        ]);

        Address::create([
            'address' => 'Rivers',
            'latitude' => '5.628262',
            'longitude' => '4.6278292'
        ]);

        Address::create([
            'address' => 'Kebbi',
            'latitude' => '5.628262',
            'longitude' => '4.6278292'
        ]);

        Address::create([
            'address' => 'Yola',
            'latitude' => '5.628262',
            'longitude' => '4.6278292'
        ]);
    }
}
