<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Products;

class ProductsController extends Controller
{
    public function __construct() {

    }

    public function __invoke(Request $request)
    {
        return view(
            'products/table'
        );
    }

    public function edit(Request $request) {
        return view(
            'products/edit'
        );
    }

    public function getProduct(Request $request) {
        if(auth()->guard()->check()) {
            return Products::where('id', $request->id)->get()[0];
        } else {
            return null;
        }
    }

    public function getProducts() {
        return Products::with('category')->with('subcategory')->get();
    }

    public function deleteProduct(Request $request) {
        return Products::find($request->id)->delete();
    }

    public function addProduct(Request $request) {
        if(auth()->guard()->check()) {
            $validated = $request->validate([
                'title' => 'required|min:2|max:255',
                'vendor_code' => 'required|min:2|max:255'
            ], $this->messages(), $this->attributes());

            if (empty($request->purchase_price)) {
                $request->purchase_price = 0;
            } else if (empty($request->retail_price)) {
                $request->retail_price = 0;
            }

            if (isset($request->id)) {
                $product = Products::find($request->id);
                $product->title = $request->title;
                $product->quantity = $request->quantity;
                $product->vendor_code = $request->vendor_code;
                $product->purchase_price = $request->purchase_price;
                $product->retail_price = $request->retail_price;
                $product->waybill = $request->waybill;
                $product->category_id = $request->category;
                $product->subcategory_id = $request->subcategory;
                $product->description = $request->description;
                $product->save();
                return [
                    'id' => $request->id,
                    'success' => true,
                    'message' => 'Товар успешно обновлен!'
                ];

            } else {
                //$count = Products::where('vendor_code', $request->vendor_code)->count();
                //if ($count == 0) {

                    $product = Products::create([
                        'title' => $request->title,
                        'quantity' => $request->quantity,
                        'vendor_code' => $request->vendor_code,
                        'purchase_price' => $request->purchase_price,
                        'retail_price' => $request->retail_price,
                        'waybill' => $request->waybill,
                        'category_id' => $request->category,
                        'subcategory_id' => $request->subcategory,
                        'description' => $request->description,
                    ]);

                    return [
                        'id' => $product->id,
                        'success' => true,
                        'message' => 'Товар успешно добавлен!'
                    ];
                    return $request;
                /*} else {
                    return [
                        'success' => false,
                        'message' => 'Товар с таким артулом уже существует.'
                    ];
                }*/
            }
        } else {
            return null;
        }
    }
}
