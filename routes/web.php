<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\UserAuthorizationsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/main', HomeController::class) -> name('main');
Route::get('/users', UsersController::class) -> name('users');
Route::get('/users/add', [UsersController::class, 'edit']) -> name('users.add');
Route::get('/users/getusers', [UsersController::class, 'getUsers']) -> name('users.getusers');
Route::get('/users/{id}', [UsersController::class, 'edit']) -> name('users.edit');
Route::get('/getuser', [UserAuthorizationsController::class, 'getUser']);

Route::post('/users/adduser', [UsersController::class, 'addUser']);
Route::post('/users/getuser', [UsersController::class, 'getUser']);
Route::post('/login', [UserAuthorizationsController::class, 'login']);
Route::post('/logout', [UserAuthorizationsController::class, 'logout']);


Route::get('/categories', CategoriesController::class) -> name('categories');
Route::get('/categories/add', [CategoriesController::class, 'edit']) -> name('categories.add');
Route::get('/categories/getcategories', [CategoriesController::class, 'getCategories']) -> name('categories.getcategories');
Route::get('/categories/{id}', [CategoriesController::class, 'edit']) -> name('categories.edit');


Route::post('/categories/addcategory', [CategoriesController::class, 'addCategory']);
Route::post('/categories/getcategory', [CategoriesController::class, 'getCategory']);

Route::post('/categories/addsubcategory', [CategoriesController::class, 'addSubcategory']);
Route::post('/categories/getsubcategories', [CategoriesController::class, 'getSubCategories']);
Route::post('/categories/deletecategory', [CategoriesController::class, 'deleteCategory']);
Route::post('/categories/deletesubcategory', [CategoriesController::class, 'deleteSubcategory']);

Route::get('/products', ProductsController::class) -> name('products');
Route::get('/products/add', [ProductsController::class, 'edit']) -> name('products.add');
Route::get('/products/getproducts', [ProductsController::class, 'getProducts']) -> name('categories.getproducts');

Route::post('/products/addproduct', [ProductsController::class, 'addProduct']);
Route::get('/products/{id}', [ProductsController::class, 'edit']) -> name('products.edit');

Route::post('/products/getproduct', [ProductsController::class, 'getProduct']);
Route::post('/products/deleteproduct', [ProductsController::class, 'deleteProduct']);





