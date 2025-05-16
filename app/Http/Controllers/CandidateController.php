<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Department;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class CandidateController extends Controller
{
    public function index()
    {
        $totalActive = Candidate::where('status', 'Active')->count();
        $totalInactive = Candidate::where('status', 'Inactive')->count();
        $totalCandidates = $totalActive + $totalInactive;

        $candidates = Candidate::with(['department', 'createdByUser', 'interviewRounds' => function($query) {
            $query->where('round_number', 1);
        }])
            ->where('status', 'Active')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        // Convert pagination to array and add totals
        $candidatesData = $candidates->toArray();
        $candidatesData['total_active'] = $totalActive;
        $candidatesData['total_inactive'] = $totalInactive;
        $candidatesData['total_all'] = $totalCandidates;

        return Inertia::render('ResumeTracker/CandidateMaster', [
            'candidates' => $candidatesData,
            'departments' => Department::where('is_active', true)
                ->orderBy('department_name')
                ->get(),
        ]);
    }

    public function filter(Request $request)
    {
        $query = Candidate::with(['department', 'createdByUser', 'interviewRounds']);

        // Add status filter
        $query->where('status', 'Active');  // Default to Active candidates only

        // Get total counts for active and inactive
        $totalActive = Candidate::where('status', 'Active')->count();
        $totalInactive = Candidate::where('status', 'Inactive')->count();
        $totalCandidates = $totalActive + $totalInactive;

        // Application Date Range Filter
        if ($request->filled('application_date_from')) {
            $query->whereDate('application_date', '>=', $request->application_date_from);
        }
        if ($request->filled('application_date_to')) {
            $query->whereDate('application_date', '<=', $request->application_date_to);
        }

        // Interview Date Range Filter (modified to use round 1)
        if ($request->filled('interview_date_from') || $request->filled('interview_date_to')) {
            $query->whereHas('interviewRounds', function ($q) use ($request) {
                $q->where('round_number', 1);
                if ($request->filled('interview_date_from')) {
                    $q->whereDate('interview_date', '>=', $request->interview_date_from);
                }
                if ($request->filled('interview_date_to')) {
                    $q->whereDate('interview_date', '<=', $request->interview_date_to);
                }
            });
        }

        // Name Filter
        if ($request->filled('full_name')) {
            $query->where('full_name', 'like', '%' . $request->full_name . '%');
        }

        // Contact Number Filter
        if ($request->filled('contact_number')) {
            $query->where('contact_number', 'like', '%' . $request->contact_number . '%');
        }

        // Department Filter
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // Position Filter
        if ($request->filled('position_applied')) {
            $query->where('position_applied', 'like', '%' . $request->position_applied . '%');
        }

        // Final Status Filter
        if ($request->filled('final_status')) {
            $query->where('final_status', $request->final_status);
        }

        $candidates = $query->orderBy('created_at', 'desc')->paginate(50);
        
        // Create response with pagination data and totals
        $response = array_merge($candidates->toArray(), [
            'total_active' => $totalActive,
            'total_inactive' => $totalInactive,
            'total_all' => $totalCandidates,
        ]);

        return response()->json($response);
    }

    public function create()
    {
        $departments = Department::where('is_active', true)
            ->orderBy('department_name')
            ->get();

        $documentCategories = DocumentCategory::where('is_active', true)
            ->get();

        return Inertia::render('ResumeTracker/CreateCandidate', [
            'departments' => $departments,
            'documentCategories' => $documentCategories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:100',
            'department_id' => 'required|exists:departments,id',
            'position_applied' => 'required|string|max:100',
            'contact_number' => 'required|string|max:15',
            'email' => 'nullable|email|max:100',
            'city' => 'nullable|string|max:100',
            'education' => 'nullable|string|max:200',
            'experience_years' => 'nullable|numeric|min:0|max:99.99',
            'current_organization' => 'nullable|string|max:100',
            'current_salary' => 'nullable|numeric|min:0',
            'expected_salary' => 'nullable|numeric|min:0',
            'referred_by' => 'nullable|string|max:100',
            'referred_type' => 'required|string|max:100',
            'remarks' => 'nullable|string',
            'interview_date' => 'nullable|date',
            'document_category_id' => 'nullable|required_with:document_file|exists:document_categories,id',
            'document_file' => 'required|file|mimes:pdf,doc,docx,txt,jpg,jpeg,png|max:10240',
            'document_file_name' => 'nullable|required_with:document_file|string|max:255',
        ]);

        $validated['created_by_user_id'] = $request->user()->id;
        $validated['application_date'] = now();

        $candidate = Candidate::create($validated);

        // Create timeline event for candidate creation
        $candidate->timelineEvents()->create([
            'event_type' => 'Created',
            'event_description' => 'Candidate profile created',
            'created_by_user_id' => $request->user()->id,
        ]);

        // Handle document upload if present
        if ($request->hasFile('document_file') && $request->filled('document_category_id')) {
            $file = $request->file('document_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('candidate_documents', $fileName, 'public');

            $category = DocumentCategory::find($request->document_category_id);
            
            $candidate->documents()->create([
                'category_id' => $request->document_category_id,
                'document_name' => $request->document_file_name,
                'original_filename' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_type' => $file->getClientOriginalExtension(),
                'uploaded_by_user_id' => $request->user()->id,
                'upload_datetime' => now(),
            ]);

            // Add timeline event for document upload
            $candidate->timelineEvents()->create([
                'event_type' => 'UploadDocument',
                'event_description' => "Document uploaded: {$request->document_file_name} in {$category->category_name}",
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        return redirect()->route('candidates.index')
            ->with('success', 'Candidate created successfully.');
    }

    public function edit(Candidate $candidate)
    {
        $departments = Department::where('is_active', true)
            ->orderBy('department_name')
            ->get();

        $documentCategories = DocumentCategory::where('is_active', true)
            ->get();

        return Inertia::render('ResumeTracker/EditCandidate', [
            'candidate' => $candidate->load([
                'department', 
                'timelineEvents.createdByUser', 
                'documents.category',
                'interviewRounds' => function($query) {
                    $query->orderBy('round_number');
                }
            ]),
            'departments' => $departments,
            'documentCategories' => $documentCategories
        ]);
    }

    public function update(Request $request, Candidate $candidate)
    {
        $validated = $request->validate([
            'application_date' => 'required|date',
            'full_name' => 'required|string|max:100',
            'department_id' => 'required|exists:departments,id',
            'position_applied' => 'required|string|max:100',
            'contact_number' => 'required|string|max:15',
            'email' => 'nullable|email|max:100',
            'city' => 'nullable|string|max:50',
            'education' => 'nullable|string|max:100',
            'experience_years' => 'nullable|numeric',
            'current_organization' => 'nullable|string|max:100',
            'current_salary' => 'nullable|numeric',
            'expected_salary' => 'nullable|numeric',
            'offered_salary' => 'nullable|numeric',
            'interview_date' => 'nullable|date',
            'interview_status' => 'nullable|string',
            'final_status' => 'nullable|string',
            'referred_by' => 'nullable|string|max:100',
            'referred_type' => 'nullable|string|max:100',
            'remarks' => 'nullable|string',
            'timeline_note' => 'nullable|string',
            'document_category_id' => 'nullable|required_with:document_file|exists:document_categories,id',
            'document_file' => 'nullable|file|mimes:pdf,doc,docx,txt,jpg,jpeg,png|max:10240',
            'document_file_name' => 'nullable|required_with:document_file|string|max:255',
            'interview_rounds' => 'nullable|array',
            'interview_rounds.*.round_number' => 'nullable|integer|min:1|max:3',
            'interview_rounds.*.interviewer_name' => 'nullable|string|max:100',
            'interview_rounds.*.status' => 'nullable|string|in:Pending,Selected,Rejected,On Hold,No Show',
            'interview_rounds.*.feedback' => 'nullable|string',
            'interview_rounds.*.interview_date' => 'nullable|date',
            'status' => 'required|in:Active,Inactive',
        ]);

        // Get original values before update
        $originalValues = [
            'interview_date' => $candidate->interview_date,
            'interview_status' => $candidate->interview_status,
            'offered_salary' => $candidate->offered_salary,
            'final_status' => $candidate->final_status,
        ];

        // Update candidate details
        $candidate->update(collect($validated)->except(['timeline_note', 'document_category_id', 'document_file', 'document_file_name', 'interview_rounds'])->toArray());

        // Track changes in interview details
        if (
            $request->filled('interview_date') &&
            $request->interview_date != ($originalValues['interview_date'] ? $originalValues['interview_date']->format('Y-m-d') : null)
        ) {
            $candidate->timelineEvents()->create([
                'event_type' => 'UpdateInterviewDate',
                'event_description' => 'Interview date postponded from  ' . date('d/m/Y', strtotime($originalValues['interview_date'])) . ' to ' . date('d/m/Y', strtotime($request->interview_date)),
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        if ($request->filled('interview_status') && $request->interview_status != $originalValues['interview_status']) {
            $candidate->timelineEvents()->create([
                'event_type' => 'UpdateInterviewStatus',
                'event_description' => 'Interview status changed to ' . $request->interview_status,
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        if ($request->filled('offered_salary') && $request->offered_salary != $originalValues['offered_salary']) {
            $candidate->timelineEvents()->create([
                'event_type' => 'UpdateOfferedSalary',
                'event_description' => 'Offered salary updated to ₹' . number_format($request->offered_salary, 2),
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        if ($request->filled('final_status') && $request->final_status != $originalValues['final_status']) {
            $candidate->timelineEvents()->create([
                'event_type' => 'UpdateFinalStatus',
                'event_description' => 'Final status changed to ' . $request->final_status,
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        // Track status change in timeline
        if ($request->filled('status') && $request->status != $candidate->status) {
            $candidate->timelineEvents()->create([
                'event_type' => 'UpdateStatus',
                'event_description' => 'Candidate status changed to ' . $request->status,
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        // Handle document upload if present
        if ($request->hasFile('document_file') && $request->filled('document_category_id') && $request->filled('document_file_name')) {
            $file = $request->file('document_file');
            $category = DocumentCategory::findOrFail($request->document_category_id);

            // Create folder structure
            $folderPath = "candidate_documents/{$candidate->id}/{$category->id}";

            // Create sanitized filename from document_file_name
            $extension = $file->getClientOriginalExtension();
            $filename = Str::slug($request->document_file_name) . '.' . $extension;

            // Create full filepath
            $filepath = "{$folderPath}/{$filename}";

            // Store the file
            Storage::disk('public')->putFileAs($folderPath, $file, $filename);

            // Create document record
            $candidate->documents()->create([
                'category_id' => $request->document_category_id,
                'document_name' => $request->document_file_name,
                'original_filename' => $file->getClientOriginalName(),
                'file_path' => $filepath,
                'file_type' => $extension,
                'uploaded_by_user_id' => $request->user()->id,
                'upload_datetime' => now(),
            ]);

            // Add timeline event for document upload
            $candidate->timelineEvents()->create([
                'event_type' => 'UploadDocument',
                'event_description' => "Document uploaded: {$request->document_file_name} in {$category->category_name}",
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        // Add timeline note if present
        if ($request->filled('timeline_note')) {
            $candidate->timelineEvents()->create([
                'event_type' => 'Note',
                'event_description' => $request->timeline_note,
                'created_by_user_id' => $request->user()->id,
            ]);
        }

        // Update interview rounds
        if ($request->filled('interview_rounds')) {
            foreach ($request->interview_rounds as $round) {
                // Only process rounds that have interviewer name (indicating they're being used)
                if (!empty($round['interviewer_name'])) {
                    // Get existing round to compare status
                    $existingRound = $candidate->interviewRounds()
                        ->where('round_number', $round['round_number'])
                        ->first();

                    $candidate->interviewRounds()->updateOrCreate(
                        ['round_number' => $round['round_number']],
                        [
                            'interviewer_name' => $round['interviewer_name'],
                            'status' => $round['status'] ?? 'Pending',
                            'feedback' => $round['feedback'],
                            'interview_date' => $round['interview_date'],
                            'created_by_user_id' => $request->user()->id,
                        ]
                    );

                    // Create timeline event only if status changed or it's a new round
                    if (!empty($round['status']) && 
                        (!$existingRound || $existingRound->status !== $round['status'])) {
                        $candidate->timelineEvents()->create([
                            'event_type' => 'InterviewRound',
                            'event_description' => "Round {$round['round_number']} interview status updated to {$round['status']}",
                            'created_by_user_id' => $request->user()->id,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('candidates.index')
            ->with('success', 'Candidate updated successfully.');
    }

    public function show(Candidate $candidate)
    {
        return Inertia::render('ResumeTracker/CandidateShow', [
            'candidate' => $candidate->load([
                'department', 
                'documents.category', 
                'interviewRounds' => function($query) {
                    $query->orderBy('round_number');
                },
                'timelineEvents.createdByUser' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                }
            ])
        ]);
    }

    public function getDepartments()
    {
        $departments = Department::where('is_active', true)
            ->orderBy('department_name')
            ->get();
        
        return response()->json($departments);
    }

    public function export(Request $request)
    {
        $query = Candidate::with(['department', 'createdByUser', 'interviewRounds']);

        // Application Date Range Filter
        if ($request->filled('application_date_from')) {
            $query->whereDate('application_date', '>=', $request->application_date_from);
        }
        if ($request->filled('application_date_to')) {
            $query->whereDate('application_date', '<=', $request->application_date_to);
        }

        // Name Filter
        if ($request->filled('full_name')) {
            $query->where('full_name', 'like', '%' . $request->full_name . '%');
        }

        // Contact Number Filter
        if ($request->filled('contact_number')) {
            $query->where('contact_number', 'like', '%' . $request->contact_number . '%');
        }

        // Department Filter
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // Position Filter
        if ($request->filled('position_applied')) {
            $query->where('position_applied', 'like', '%' . $request->position_applied . '%');
        }

        // Interview Status Filter
        if ($request->filled('interview_status')) {
            $query->where('interview_status', $request->interview_status);
        }

        // Final Status Filter
        if ($request->filled('final_status')) {
            $query->where('final_status', $request->final_status);
        }

        $candidates = $query->orderBy('created_at', 'desc')->get();

        // Create CSV content
        $headers = [
            'Application Date',
            'Full Name',
            'City',
            'Department',
            'Position Applied',
            'Contact Number',
            'Email',
            'Experience (Years)',
            'Current Organization',
            'Expected Salary',
            'Current Salary',
            'Offered Salary',
            'Round 1 Interview Date',
            'Round 1 Interview Status',
            'Round 1 Interviewer Name',
            'Round 1 Feedback',
            'Round 2 Interview Date',
            'Round 2 Interview Status',
            'Round 2 Interviewer Name',
            'Round 2 Feedback',
            'Round 3 Interview Date',
            'Round 3 Interview Status',
            'Round 3 Interviewer Name',
            'Round 3 Feedback',
            'Final Interview Status',
            'Final Status',
            'Referred Type',
            'Referred By',
            'Remarks'
        ];

        $callback = function() use ($candidates, $headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($candidates as $candidate) {
                // Get interview rounds data
                $rounds = $candidate->interviewRounds()
                    ->orderBy('round_number')
                    ->get()
                    ->keyBy('round_number');

                fputcsv($file, [
                    $candidate->application_date ? date('d/m/Y', strtotime($candidate->application_date)) : '',
                    $candidate->full_name,
                    $candidate->city,
                    $candidate->department->department_name ?? '',
                    $candidate->position_applied,
                    $candidate->contact_number,
                    $candidate->email,
                    $candidate->experience_years,
                    $candidate->current_organization,
                    $candidate->expected_salary,
                    $candidate->current_salary,
                    $candidate->offered_salary,
                    // Round 1
                    $rounds->get(1)?->interview_date ? date('d/m/Y', strtotime($rounds->get(1)->interview_date)) : '',
                    $rounds->get(1)?->status ?? '',
                    $rounds->get(1)?->interviewer_name ?? '',
                    $rounds->get(1)?->feedback ?? '',
                    // Round 2
                    $rounds->get(2)?->interview_date ? date('d/m/Y', strtotime($rounds->get(2)->interview_date)) : '',
                    $rounds->get(2)?->status ?? '',
                    $rounds->get(2)?->interviewer_name ?? '',
                    $rounds->get(2)?->feedback ?? '',
                    // Round 3
                    $rounds->get(3)?->interview_date ? date('d/m/Y', strtotime($rounds->get(3)->interview_date)) : '',
                    $rounds->get(3)?->status ?? '',
                    $rounds->get(3)?->interviewer_name ?? '',
                    $rounds->get(3)?->feedback ?? '',
                    // Final statuses
                    $candidate->interview_status,
                    $candidate->final_status,
                    $candidate->referred_type,
                    $candidate->referred_by,
                    $candidate->remarks
                ]);
            }
            fclose($file);
        };

        $filename = 'candidates_' . date('Y-m-d_His') . '.csv';

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
