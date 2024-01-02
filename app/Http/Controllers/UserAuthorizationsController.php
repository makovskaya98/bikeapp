<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use Hash;
use Cookie;

class UserAuthorizationsController extends Controller
{


    public function logout(Request $request) {
        Session::flush();
        Auth::logout();
        return response()->json(['message' => 'Успешный выход из системы'], 200);
    }

    public function login(Request $request) {
        $credentials = $request->only('login', 'password');
        if (Auth::attempt($credentials)) {
            $token = $request->user()->createToken('app')->plainTextToken;
            return response()->json(['token' => $token], 200);
        } else {
            return response()->json(['message' => 'Неверные учетные данные'], 401);
        }
    }

    public function getUser(Request $request) {
        if (auth()->check()) {
            return response()->json(['authenticated' => true]);
        } else {
            return response()->json(['authenticated' => false]);
        }
    }

}
