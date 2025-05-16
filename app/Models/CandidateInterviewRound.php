<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateInterviewRound extends Model
{
    protected $fillable = [
        'candidate_id',
        'round_number',
        'interviewer_name',
        'status',
        'feedback',
        'interview_date',
        'created_by_user_id'
    ];

    protected $casts = [
        'interview_date' => 'date',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
} 