<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateDocument extends Model
{
    protected $fillable = [
        'candidate_id',
        'category_id',
        'document_name',
        'original_filename',
        'file_path',
        'file_type',
        'upload_datetime',
        'uploaded_by_user_id',
        'verified_datetime',
        'verified_by_user_id'
    ];

    protected $casts = [
        'upload_datetime' => 'datetime',
        'verified_datetime' => 'datetime'
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(DocumentCategory::class, 'category_id');
    }

    public function uploadedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_user_id');
    }

    public function verifiedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }
} 