<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Админ',
            'login' => 'admin',
            'email' => 'admin@admin.admin',
            'password' => Hash::make('Admin123'),
            'activity' => 1,
            'role' => 1
        ]);
    }
}
