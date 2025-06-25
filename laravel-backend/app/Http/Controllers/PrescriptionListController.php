<?php

namespace App\Http\Controllers;

use App\Models\PrescriptionList;
use Illuminate\Http\Request;

class PrescriptionListController extends Controller
{
    /**
     * List all prescription items for a prescription.
     */
    public function index($prescriptionId)
    {
        $items = PrescriptionList::with('drug')
            ->where('prescription_id', $prescriptionId)
            ->get();

        return response()->json($items);
    }

    /**
     * Add a new drug to a prescription.
     */
    public function store(Request $request)
    {
        $request->validate([
            'prescription_id' => 'required|exists:prescriptions,id',
            'drug_id' => 'required|exists:drugs,id',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $item = PrescriptionList::create($request->only([
            'prescription_id', 'drug_id', 'quantity', 'unit_price'
        ]));

        return response()->json([
            'message' => 'Item added to prescription successfully.',
            'item' => $item->load('drug'),
        ], 201);
    }

    /**
     * Update a drug in a prescription.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'nullable|integer|min:1',
            'unit_price' => 'nullable|numeric|min:0',
        ]);

        $item = PrescriptionList::findOrFail($id);

        $item->update($request->only(['quantity', 'unit_price']));

        return response()->json([
            'message' => 'Prescription item updated successfully.',
            'item' => $item->load('drug'),
        ]);
    }

    /**
     * Delete a drug from a prescription.
     */
    public function destroy($id)
    {
        $item = PrescriptionList::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Prescription item deleted.']);
    }
 

}
