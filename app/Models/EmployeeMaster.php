<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeMaster extends Model
{
    use HasFactory;

    protected $table = 'employee_master';

    protected $fillable = [
        'employee_code',
        'full_name',
        'gender',
        'whatsapp_number',
        'department',
        'category',
        'is_active',
        'effective_from',
        'effective_till',
        'self_dob',
        'employee_photograph',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'self_dob' => 'date',
        'is_active' => 'string',
    ];

    public function dependents()
    {
        return $this->hasOne(EmployeeDependent::class, 'employee_id');
    }
}