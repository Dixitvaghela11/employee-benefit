<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeDependent extends Model
{
    use HasFactory;

    protected $table = 'employee_dependent_master';

    protected $fillable = [
        'employee_id',
        'spouse_name',
        'spouse_dob',
        'spouse_age',
        'spouse_photograph',
        'dependent1_name',
        'dependent1_dob',
        'dependent1_age',
        'dependent1_photograph',
        'dependent2_name',
        'dependent2_dob',
        'dependent2_age',
        'dependent2_photograph',
        'additional_dependent1_name',
        'additional_dependent1_dob',
        'additional_dependent1_age',
        'additional_dependent1_photograph',
        'additional_dependent2_name',
        'additional_dependent2_dob',
        'additional_dependent2_age',
        'additional_dependent2_photograph',
        'father_name',
        'father_dob',
        'father_age',
        'father_photograph',
        'mother_name',
        'mother_dob',
        'mother_age',
        'mother_photograph',
        'additional_dependent3_name',
        'additional_dependent3_dob',
        'additional_dependent3_age',
        'additional_dependent3_photograph',
        'spouse_status',
        'dependent1_status',
        'dependent2_status',
        'additional_dependent1_status',
        'additional_dependent2_status',
        'father_status',
        'mother_status',
        'additional_dependent3_status',
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeMaster::class, 'employee_id');
    }
}
