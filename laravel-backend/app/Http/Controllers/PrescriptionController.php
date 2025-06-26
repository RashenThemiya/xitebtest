<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Models\PrescriptionImage;
use Illuminate\Http\Request;
use App\Mail\PrescriptionQuotationedMail;
use Illuminate\Support\Facades\Mail; // ✅ THIS is correct // ← Make sure this exists
class PrescriptionController extends Controller
{
    /**
     * Store a new prescription with images saved as BLOB.
     */public function store(Request $request)
{
    try {
        // ✅ Validate input
        $validated = $request->validate([
            'note' => 'nullable|string',
            'delivery_address' => 'nullable|string',
            'delivery_time' => 'nullable|date',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:604800', // ~6MB per image
        ]);

        // ✅ Create prescription
        $prescription = Prescription::create([
            'user_id' => auth()->id(),
            'note' => $validated['note'] ?? null,
            'delivery_address' => $validated['delivery_address'] ?? null,
            'delivery_time' => $validated['delivery_time'] ?? null,
        ]);

        // ✅ Process each image
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                try {
                    $imageData = file_get_contents($image->getRealPath());

                    PrescriptionImage::create([
                        'prescription_id' => $prescription->id,
                        'img' => $imageData,
                    ]);
                } catch (\Exception $imgEx) {
                    // Optional: rollback or log error per image
                    return response()->json([
                        'message' => 'Image upload failed.',
                        'error' => $imgEx->getMessage(),
                    ], 500);
                }
            }
        }

        return response()->json([
            'message' => 'Prescription submitted successfully!',
            'prescription' => $prescription->load('images'),
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $ve) {
        // ❌ Validation failure
        return response()->json([
            'message' => 'Validation failed.',
            'errors' => $ve->errors(),
        ], 422);
    } catch (\Exception $e) {
        // ❌ Unexpected failure
        return response()->json([
            'message' => 'An unexpected error occurred.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * Get prescriptions of authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $prescriptions = Prescription::with('images')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'prescriptions' => $prescriptions,
        ]);
    }

    /**
     * Get all prescriptions (admin view).
     */
    public function all()
    {
        $prescriptions = Prescription::with([
            'user:id,name,email,address,contact_no,dob',
            'images:id,prescription_id,img',
            'lists.drug:id,name'
        ])->orderBy('created_at', 'desc')->get();

        $data = $prescriptions->map(function ($prescription) {
            $totalPrice = $prescription->lists->sum(fn($item) => $item->quantity * $item->unit_price);

            return [
                'id' => $prescription->id,
                'user' => $prescription->user,
                'status' => $prescription->status,
                'note' => $prescription->note,
                'delivery_address' => $prescription->delivery_address,
                'delivery_time' => $prescription->delivery_time,
                'images' => $prescription->images,
                'prescription_list' => $prescription->lists->map(fn($item) => [
                    'drug_name' => $item->drug->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => $item->quantity * $item->unit_price,
                ]),
                'total_price' => $totalPrice,
                'created_at' => $prescription->created_at,
            ];
        });

        return response()->json(['prescriptions' => $data]);
    }

    /**
     * Update a prescription.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'note' => 'nullable|string',
            'delivery_address' => 'nullable|string',
            'delivery_time' => 'nullable|date',
            'status' => 'nullable|string|in:pending,quotationed,approved,delivery,delivered',
        ]);

        $prescription = Prescription::findOrFail($id);

        if ($prescription->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $prescription->update([
            'note' => $request->note ?? $prescription->note,
            'delivery_address' => $request->delivery_address ?? $prescription->delivery_address,
            'delivery_time' => $request->delivery_time ?? $prescription->delivery_time,
            'status' => $request->status ?? $prescription->status,
        ]);

        return response()->json([
            'message' => 'Prescription updated successfully!',
            'prescription' => $prescription->load('images'),
        ]);
    }

    /**
     * Show summary for a prescription.
     */
    public function summary($id)
    {
        $prescription = Prescription::with([
            'user:id,name,email,contact_no',
            'images:id,prescription_id,img',
            'lists.drug:id,name'
        ])->findOrFail($id);

        $totalPrice = $prescription->lists->sum(fn($item) => $item->quantity * $item->unit_price);

        return response()->json([
            'id' => $prescription->id,
            'user' => $prescription->user,
            'status' => $prescription->status,
            'note' => $prescription->note,
            'delivery_address' => $prescription->delivery_address,
            'delivery_time' => $prescription->delivery_time,
            'prescription_list' => $prescription->lists->map(fn($item) => [
                'drug_name' => $item->drug->name,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total' => $item->quantity * $item->unit_price,
            ]),
            'total_price' => $totalPrice,
            'created_at' => $prescription->created_at,
        ]);
    }

    /**
     * Delete a prescription and associated images.
     */
    public function destroy($id)
    {
        $prescription = Prescription::with('images')->findOrFail($id);

        if ($prescription->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        foreach ($prescription->images as $image) {
            $image->delete(); // image data is stored in DB, not filesystem
        }

        $prescription->delete();

        return response()->json(['message' => 'Prescription and images deleted successfully']);
    }

    /**
     * Show full prescription with user info.
     */
    public function show($id)
    {
        $prescription = Prescription::with([
            'user:id,name,email,address,contact_no,dob',
            'images:id,prescription_id,img',
            'lists.drug:id,name'
        ])->findOrFail($id);

        $totalPrice = $prescription->lists->sum(fn($item) => $item->quantity * $item->unit_price);

        return response()->json([
            'id' => $prescription->id,
            'status' => $prescription->status,
            'note' => $prescription->note,
            'delivery_address' => $prescription->delivery_address,
            'delivery_time' => $prescription->delivery_time,
            'created_at' => $prescription->created_at,
            'total_price' => $totalPrice,
            'customer' => [
                'id' => $prescription->user->id,
                'name' => $prescription->user->name,
                'email' => $prescription->user->email,
                'address' => $prescription->user->address,
                'contact_no' => $prescription->user->contact_no,
                'dob' => $prescription->user->dob,
            ],
            'images' => $prescription->images->map(fn($img) => [
                'id' => $img->id,
                'img' => $img->img, // this will be base64 encoded by accessor
            ]),
            'prescription_list' => $prescription->lists->map(fn($item) => [
                'drug_name' => $item->drug->name,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total' => $item->quantity * $item->unit_price,
            ]),
        ]);
    }
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|string|in:pending,quotationed,approved,delivery,delivered',
    ]);

    $prescription = Prescription::findOrFail($id);
    $oldStatus = $prescription->status;

    $prescription->status = $request->status;
    $prescription->save();

    // Send email only if status is changed to 'quotationed'
    if ($oldStatus !== 'quotationed' && $request->status === 'quotationed') {
        $user = $prescription->user; // assumes relationship exists

        if ($user && $user->email) {
            Mail::to($user->email)->send(new PrescriptionQuotationedMail($prescription));
        }
    }

    return response()->json([
        'message' => 'Prescription status updated successfully.',
        'prescription' => $prescription,
    ]);
}
}