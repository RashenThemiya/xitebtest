<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    protected $fillable = [
        'user_id', 'status', 'note', 'delivery_address', 'delivery_time'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(PrescriptionImage::class);
    }

    public function lists()
    {
        return $this->hasMany(PrescriptionList::class);
    }
}
