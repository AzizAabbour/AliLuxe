<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            Address::where('user_id', $request->user()->id)->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'label' => 'string|max:50',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address_line_1' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'phone' => 'nullable|string|max:20',
        ]);

        $data = $request->all();
        $data['user_id'] = $request->user()->id;

        if ($request->is_default) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        $address = Address::create($data);

        return response()->json(['address' => $address, 'message' => 'Address added'], 201);
    }

    public function update(Request $request, Address $address)
    {
        if ($request->is_default) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }
        $address->update($request->all());
        return response()->json(['address' => $address, 'message' => 'Address updated']);
    }

    public function destroy(Address $address)
    {
        $address->delete();
        return response()->json(['message' => 'Address deleted']);
    }
}
