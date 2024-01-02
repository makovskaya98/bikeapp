<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UsersController extends Controller
{
    public function __construct() {

    }

    public function __invoke(Request $request) {
        return view(
            'users/table'
        );
    }

    public function edit(Request $request) {
        return view(
            'users/edit'
        );
    }

    public function getUser(Request $request) {
        if(auth()->guard()->check()) {
            return User::where('id', $request->id)->get()[0];
        } else {
            return null;
        }
    }

    public function getUsers() {
        if(auth()->guard()->check()) {
            return User::get();
        } else {
            return null;
        }
    }

    public function addUser(Request $request) {
        if(auth()->guard()->check()) {
            $validated = $request->validate([
                'name' => 'required|min:2|max:50',
                'login' => 'required|min:2|max:50',
                'email' => 'max:50',
                'password' => ['required', Password::min(8)->letters()->mixedCase()->numbers()]
            ], $this->messages(), $this->attributes());
            if (isset($request->id)) {
                $user = User::find($request->id);
                $user->name = $request->name;
                $user->login = $request->login;
                $user->email = $request->email;
                $user->role = $request->role;
                $user->activity = $request->activity;
                $user->password = $request->password;
                $user->save();
                return [
                    'user_id' => $request->id,
                    'success' => true,
                    'message' => 'Пользователь успешно обновлен!'
                ];
            } else {
                $count_user = User::where('email', $request->email)->count();
                if ($count_user == 0) {
                    $user = User::create([
                        'name' => $request->name,
                        'login' => $request->login,
                        'email' => $request->email,
                        'role' => $request->role,
                        'activity' => $request->activity,
                        'password' => Hash::make($request->password),
                    ]);

                    return [
                        'user_id' => $user->id,
                        'success' => true,
                        'message' => 'Пользователь успешно создан!'
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => 'Пользователь с таким email уже существует.'
                    ];
                }
            }
        } else {
            return null;
        }
    }
}
