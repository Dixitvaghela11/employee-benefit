<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimelineEvent extends Model
{
    protected $fillable = [
        'candidate_id',
        'event_type',
        'event_description',
        'event_datetime',
        'created_by_user_id',
        'additional_data'
    ];

    protected $casts = [
        'event_datetime' => 'datetime',
        'additional_data' => 'json'
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