<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrescriptionImage extends Model
{
    protected $fillable = ['prescription_id', 'img'];

    // Relationship: each image belongs to one prescription
    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    /**
     * Accessor: Convert raw BLOB image data to base64 string
     * so frontend can use it in <img src="..."> easily.
     */
    public function getImgAttribute($value)
    {
        return base64_encode($value);
    }

    /**
     * Helper to return base64 image with data URI prefix (e.g. usable in <img src="...">)
     * You can call $image->img_url
     */
    public function getImgUrlAttribute()
    {
        return 'data:image/jpeg;base64,' . base64_encode($this->attributes['img']);
    }
}
