<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DrugController as DrugsController;
use App\Http\Controllers\PrescriptionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Check if user is logged in
Route::middleware('auth:api')->get('/check-login', function () {
    return response()->json([
        'message' => 'You are authenticated',
        'user' => auth()->user(),
    ]);
});

// JWT protected routes
Route::middleware('auth:api')->group(function () {

    Route::post('/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/prescriptions', [PrescriptionController::class, 'index']);
        Route::put('/prescriptions/{id}', [PrescriptionController::class, 'update']);
    Route::put('/admin/prescriptions/{id}/status', [PrescriptionController::class, 'updateStatus']);

});
// Drug routes (authenticated)
Route::middleware('auth:api')->group(function () {
    Route::get('/drugs', [DrugsController::class, 'index']);        // List all drugs
    Route::post('/drugs', [DrugsController::class, 'store']);       // Create a new drug
    Route::get('/drugs/{id}', [DrugsController::class, 'show']);    // Show one drug
    Route::put('/drugs/{id}', [DrugsController::class, 'update']);  // Update a drug
    Route::delete('/drugs/{id}', [DrugsController::class, 'destroy']); // Delete a drug
});
use App\Http\Controllers\PrescriptionListController;

Route::middleware('auth:api')->group(function () {
    Route::get('/prescriptionslist/{id}/items', [PrescriptionListController::class, 'index']);
    Route::post('/prescriptionlist-items', [PrescriptionListController::class, 'store']);
    Route::put('/prescriptionlist-items/{id}', [PrescriptionListController::class, 'update']);
    Route::delete('/prescriptionlist-items/{id}', [PrescriptionListController::class, 'destroy']);
});
Route::middleware('auth:api')->get('/drugs/search', [DrugsController::class, 'search']);

Route::middleware('auth:api')->delete('/prescriptions/{id}', [PrescriptionController::class, 'destroy']);

Route::middleware('auth:api')->get('/prescriptions/{id}/summary', [PrescriptionController::class, 'summary']);
Route::middleware('auth:api')->get('/profile', [AuthController::class, 'profile']);
Route::middleware('auth:api')->get('/admin/prescriptions/{id}', [PrescriptionController::class, 'show']);

// Admin-only route
Route::middleware(['auth:api', 'admin'])->get('/admin/prescriptions', [PrescriptionController::class, 'all']);
