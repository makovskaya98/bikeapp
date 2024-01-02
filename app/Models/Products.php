<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'quantity',
        'vendor_code',
        'purchase_price',
        'retail_price',
        'waybill',
        'category_id',
        'subcategory_id',
        'description'
    ];

    function category() {
        return $this->belongsTo(Categories::class);
    }

    function subcategory() {
        return $this->belongsTo(Subcategories::class);
    }

}
