<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    protected $fillable = [
        'application_date',
        'full_name',
        'city',
        'department_id',
        'position_applied',
        'interview_date',
        'education',
        'experience_years',
        'current_organization',
        'contact_number',
        'contact_number_2',
        'email',
        'referred_by',
        'referred_type',
        'interview_status',
        'current_salary',
        'expected_salary',
        'offered_salary',
        'final_status',
        'remarks',
        'created_by_user_id',
        'updated_by_user_id',
        'status'
    ];

    protected $casts = [
        'application_date' => 'date',
        'interview_date' => 'date',
        'experience_years' => 'decimal:2',
        'current_salary' => 'decimal:2',
        'expected_salary' => 'decimal:2',
        'offered_salary' => 'decimal:2'
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(CandidateDocument::class);
    }

    public function timelineEvents(): HasMany
    {
        return $this->hasMany(TimelineEvent::class);
    }

    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function updatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }

    public function interviewRounds(): HasMany
    {
        return $this->hasMany(CandidateInterviewRound::class);
    }
} 