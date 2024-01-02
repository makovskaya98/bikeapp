<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>BIKECLINIC</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        @viteReactRefresh
        @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    </head>
    <body>
        @if (Route::currentRouteName() != 'home')
        <header>
            <div class="header-container">
                <div class="navigation">
                    <div class="logo"><span>BikeClinic</span></div>
                    <div class="nav-container">
                        <div class="contact"><a href="#"><i class="bi bi-phone"></i>+375 (29) 111-11-11</a></div>
                    </div>
                </div>
            </div>
        </header>
        <div class="page">
            <div class="page-wrapper">
                @yield('content')
            </div>
        </div>
        @endif
    </body>
</html>


