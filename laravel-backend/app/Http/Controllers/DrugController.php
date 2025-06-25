<?php

namespace App\Http\Controllers;

use App\Models\Drug;
use Illuminate\Http\Request;

class DrugController extends Controller
{
    // List all drugs
    public function index()
    {
        $drugs = Drug::all();
        return response()->json($drugs);
    }

    // Show a single drug by id
    public function show($id)
    {
        $drug = Drug::find($id);
        if (!$drug) {
            return response()->json(['message' => 'Drug not found'], 404);
        }
        return response()->json($drug);
    }

    // Create new drug
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $drug = Drug::create([
            'name'  => $request->name,
            'price' => $request->price,
        ]);

        return response()->json($drug, 201);
    }

    // Update existing drug by id
    public function update(Request $request, $id)
    {
        $drug = Drug::find($id);
        if (!$drug) {
            return response()->json(['message' => 'Drug not found'], 404);
        }

        $request->validate([
            'name'  => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        $drug->update($request->only(['name', 'price']));

        return response()->json($drug);
    }

    // Delete a drug by id
    public function destroy($id)
    {
        $drug = Drug::find($id);
        if (!$drug) {
            return response()->json(['message' => 'Drug not found'], 404);
        }

        $drug->delete();

        return response()->json(['message' => 'Drug deleted successfully']);
    }
       public function search(Request $request)
{
    $query = $request->get('q', '');
    $results = Drug::where('name', 'LIKE', "%{$query}%")
        ->limit(10)
        ->get(['id', 'name', 'price']);

    return response()->json($results);
}
}
