<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prescription_images', function (Blueprint $table) {
            $table->binary('img')->change(); // Alter the column
        });
    }

    public function down(): void
    {
        Schema::table('prescription_images', function (Blueprint $table) {
            $table->string('img')->change(); // Optional: revert if needed
        });
    }
};
