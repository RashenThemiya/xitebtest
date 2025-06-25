<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;  // <-- Add this import

class User extends Authenticatable implements JWTSubject  // <-- Implement the interface
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'address',
        'contact_no',
        'dob',
        'role',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Required by JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    // Required by JWTSubject
    public function getJWTCustomClaims()
    {
        return [];
    }
}
