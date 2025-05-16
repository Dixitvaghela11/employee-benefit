<?php

namespace App\Http\Controllers;

use App\Models\EmployeeMaster;
use App\Models\EmployeeDependent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EmployeeDependentController extends Controller
{
    public function show($employeeId)
    {
        $employee = EmployeeMaster::findOrFail($employeeId);
        $dependent = EmployeeDependent::where('employee_id', $employeeId)->first();

        $employee->employee_photograph = $employee->employee_photograph
            ? asset("storage/{$employee->employee_photograph}")
            : null;

        $dependents = [];
        if ($dependent) {
            $relationTypes = [
                'spouse',
                'dependent1',
                'dependent2',
                'father',
                'mother',
                'additional_dependent1',
                'additional_dependent2',
                'additional_dependent3'
            ];

            foreach ($relationTypes as $type) {
                $nameField = "{$type}_name";
                if ($dependent->$nameField) {
                    $photoField = "{$type}_photograph";
                    $photoUrl = $dependent->$photoField
                        ? asset("storage/{$dependent->$photoField}")
                        : null;

                    $dependents[] = [
                        'id' => $type,
                        'name' => $dependent->{"{$type}_name"},
                        'dateOfBirth' => $dependent->{"{$type}_dob"},
                        'relation' => $type,
                        'photoUrl' => $photoUrl,
                        'status' => $dependent->{"{$type}_status"}
                    ];
                }
            }
        }

        return Inertia::render('Employee/EmployeeDependent', [
            'employee' => $employee,
            'existingDependents' => $dependents
        ]);
    }

    public function store(Request $request, $employeeId)
    {
        $validated = $request->validate([
            'dependent_type' => 'required|string',
            'name' => 'required|string',
            'dob' => 'required|date',
            'photograph' => 'nullable|image|max:2048',
        ]);

        $dependent = EmployeeDependent::firstOrNew(['employee_id' => $employeeId]);

        $type = $validated['dependent_type'];
        $dependent->{$type . '_name'} = $validated['name'];
        $dependent->{$type . '_dob'} = $validated['dob'];

        if ($request->hasFile('photograph')) {
            $path = $request->file('photograph')->store('dependents', 'public');
            $dependent->{$type . '_photograph'} = $path;
        }

        $dependent->save();

        return redirect()->back();
    }

    public function saveDependents(Request $request, $employeeId)
    {
        $employee = EmployeeMaster::findOrFail($employeeId);
        $dependent = EmployeeDependent::firstOrNew(['employee_id' => $employeeId]);

        // Handle employee photo
        if ($request->employeePhoto && str_starts_with($request->employeePhoto, 'data:image')) {
            // Extract MIME type and base64 data
            preg_match('/data:image\/(.*?);base64,(.*)/', $request->employeePhoto, $matches);
            $imageExt = $matches[1];
            $imageData = $matches[2];

            // Generate filename and filepath for employee photo
            $filename = "photo.{$imageExt}";
            $filepath = "{$employee->employee_code}/{$filename}";

            // Create directory if it doesn't exist
            Storage::disk('public')->makeDirectory($employee->employee_code);

            // Save employee image
            Storage::disk('public')->put($filepath, base64_decode($imageData));

            // Update employee record
            $employee->employee_photograph = $filepath;
            $employee->save();
        }

        // Get all possible relation types
        $relationTypes = [
            'spouse',
            'dependent1',
            'dependent2',
            'father',
            'mother',
            'additional_dependent1',
            'additional_dependent2',
            'additional_dependent3'
        ];

        // First, clear all existing dependent data
        foreach ($relationTypes as $type) {
            $dependent->{"{$type}_name"} = null;
            $dependent->{"{$type}_dob"} = null;
            $dependent->{"{$type}_photograph"} = null;
        }

        // Then, save only the dependents that are present in the request
        foreach ($request->dependents as $dep) {
            $nameField = "{$dep['relation']}_name";
            $dobField = "{$dep['relation']}_dob";
            $photoField = "{$dep['relation']}_photograph";

            // Check if the status key exists before using it
            if (isset($dep['status'])) {
                $statusField = "{$dep['relation']}_status";
                $dependent->$statusField = $dep['status'];
            }

            $dependent->$nameField = $dep['name'];
            $dependent->$dobField = $dep['dateOfBirth'];

            // Handle photo if it's a new base64 image
            if ($dep['photoUrl'] && str_starts_with($dep['photoUrl'], 'data:image')) {
                // Extract MIME type and base64 data
                preg_match('/data:image\/(.*?);base64,(.*)/', $dep['photoUrl'], $matches);
                $imageExt = $matches[1];
                $imageData = $matches[2];

                // Generate filename using relation type and original extension
                $filename = "{$dep['relation']}.{$imageExt}";
                $filepath = "{$employee->employee_code}/dependents/{$filename}";

                // Save image
                Storage::disk('public')->put($filepath, base64_decode($imageData));

                // Update database with filepath
                $dependent->$photoField = $filepath;
            } elseif ($dep['photoUrl']) {
                // Keep existing photo if it's not a new upload
                $photoPath = str_replace(asset('storage/'), '', $dep['photoUrl']);
                // Clean up multiple slashes and ensure single leading slash
                $photoPath = '/' . trim(preg_replace('#/+#', '/', $photoPath), '/');
                $dependent->$photoField = ltrim($photoPath, '/');
            }
        }

        $dependent->save();

        return response()->json(['message' => 'Employee photo and dependents saved successfully']);
    }

    public function getEmployeeDetails($employeeId)
    {
        $employee = EmployeeMaster::findOrFail($employeeId);
        $dependent = EmployeeDependent::where('employee_id', $employeeId)->first();

        $employee->employee_photograph = $employee->employee_photograph
            ? asset("storage/{$employee->employee_photograph}")
            : null;

        $dependents = [];
        if ($dependent) {
            $relationTypes = [
                'spouse',
                'dependent1',
                'dependent2',
                'father',
                'mother',
                'additional_dependent1',
                'additional_dependent2',
                'additional_dependent3'
            ];

            foreach ($relationTypes as $type) {
                $nameField = "{$type}_name";
                $statusField = "{$type}_status";

                if ($dependent->$nameField && $dependent->$statusField === 'Active') {
                    $photoField = "{$type}_photograph";
                    $photoUrl = $dependent->$photoField
                        ? asset("storage/{$dependent->$photoField}")
                        : null;

                    $dependents[] = [
                        'id' => $type,
                        'name' => $dependent->{"{$type}_name"},
                        'dateOfBirth' => $dependent->{"{$type}_dob"},
                        'relation' => $type,
                        'photoUrl' => $photoUrl,
                        'status' => $dependent->$statusField
                    ];
                }
            }
        }

        return response()->json([
            'id' => $employee->id,
            'employee_code' => $employee->employee_code,
            'full_name' => $employee->full_name,
            'department' => $employee->department,
            'is_active' => $employee->is_active,
            'gender' => $employee->gender,
            'whatsapp_number' => $employee->whatsapp_number,
            'effective_from' => $employee->effective_from,
            'effective_till' => $employee->effective_till,
            'self_dob' => $employee->self_dob,
            'employee_photograph' => $employee->employee_photograph,
            'dependents' => $dependents,
            'category' => $employee->category
        ]);
    }
}
