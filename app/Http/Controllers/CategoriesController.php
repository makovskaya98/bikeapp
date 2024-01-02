<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categories;
use App\Models\Subcategories;

class CategoriesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return view(
            'categories/table'
        );
    }

    public function edit(Request $request) {
        return view(
            'categories/edit'
        );
    }

    public function getCategory(Request $request) {
        if(auth()->guard()->check()) {
            return Categories::where('id', $request->id)->get()[0];
        } else {
            return null;
        }
    }

    public function addCategory(Request $request) {
        if(auth()->guard()->check()) {
            $validated = $request->validate([
                'title' => 'required|min:2|max:255',
            ], $this->messages(), $this->attributes());

            if (isset($request->id)) {
                $category = Categories::find($request->id);
                $category->title = $request->title;
                $category->save();
                return [
                    'id' => $request->id,
                    'success' => true,
                    'message' => 'Категория успешно обновлена!'
                ];
            } else {
                $count = Categories::where('title', $request->title)->count();
                if ($count == 0) {
                    $category = Categories::create([
                        'title' => $request->title,
                    ]);
                    return [
                        'id' => $category->id,
                        'success' => true,
                        'message' => 'Категория успешно добавлена!'
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => 'Категория с таким названием уже существует.'
                    ];
                }
            }
        } else {
            return null;
        }
    }

    public function addSubcategory(Request $request) {
        if(auth()->guard()->check()) {
            $validated = $request->validate([
                'title' => 'required|min:2|max:255',
            ], $this->messages(), $this->attributes());

            $count = Subcategories::where('title', $request->title)->count();
            if ($count == 0) {
                $category = Subcategories::create([
                    'title' => $request->title,
                    'category_id' => $request->category_id
                ]);
                return [
                    'subcategory_id' => $category->id,
                    'success' => true,
                    'message' => 'Подкатегория успешно добавлена!'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Подкатегория с таким названием уже существует.'
                ];
            }
        }
    }

    public function deleteCategory(Request $request) {
        return Categories::find($request->id)->delete();
    }

    public function deleteSubcategory(Request $request) {
        return Subcategories::find($request->id)->delete();
    }

    public function getSubCategories(Request $request) {
        return Categories::find($request->categoryid)->subcategories;
    }

    public function getCategories() {
        return Categories::with('subcategories')->get();
    }
}
