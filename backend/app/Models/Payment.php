<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['order_id', 'payment_method', 'transaction_id', 'amount', 'status', 'payment_details'];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_details' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
