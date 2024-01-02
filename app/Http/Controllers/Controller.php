<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function messages()
    {
        return [
           'required' => 'Поле :attribute обязательно для заполнения.',
           'min' => 'Поле :attribute должно быть не менее :min символов.',
           'max' => 'Поле :attribute должно быть не более :max символов.',
           'password' => [
                'letters'   => 'Поле пароля должно содержать хотя бы одну букву.',
                'numbers'   => 'Поле пароля должно содержать хотя бы одно число.',
                'mixedCase' => 'Поле пароля должно содержать хотя бы одну заглавную и одну строчную букву.',
           ],
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'имя',
            'title' => 'заголовок',
            'vendor_code' => 'артикул',
            'password' => 'пароль'
        ];
    }
}
