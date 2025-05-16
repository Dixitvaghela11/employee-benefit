<?php

namespace App\Http\Controllers;

use App\Models\EmployeeMaster;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EmployeeMasterController extends Controller
{
    public function index()
    {
        $employees = EmployeeMaster::with('dependents')
            ->select(
                'id',
                'employee_code',
                'full_name',
                'department',
                'gender',
                'whatsapp_number',
                'is_active',
                'effective_from',
                'effective_till',
                'self_dob',
                'category',
            )->paginate(50);

        $employees->through(function ($employee) {
            $dependent = $employee->dependents;
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

                    if ($dependent->$nameField) {
                        $dependents[] = [
                            'id' => $type,
                            'name' => $dependent->{"{$type}_name"},
                            'relation' => $type,
                            'status' => $dependent->$statusField ?? 'Active'
                        ];
                    }
                }
            }
            
            $employee->dependents = $dependents;
            return $employee;
        });

        return Inertia::render('Employee/EmployeeMaster', [
            'employees' => $employees
        ]);
    }

    public function filter(Request $request)
    {
        $query = EmployeeMaster::with('dependents');

        if ($request->filled('employee_code')) {
            $query->where('employee_code', 'like', '%' . $request->employee_code . '%');
        }

        if ($request->filled('full_name')) {
            $query->where('full_name', 'like', '%' . $request->full_name . '%');
        }

        if ($request->filled('department')) {
            $query->where('department', '=', $request->department);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $employees = $query->select(
            'id',
            'employee_code',
            'full_name',
            'gender',
            'whatsapp_number',
            'department',
            'category',
            'is_active',
            'effective_from',
            'effective_till',
            'self_dob'
        )->paginate(50);

        $employees->through(function ($employee) {
            $dependent = $employee->dependents;
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

                    if ($dependent->$nameField) {
                        $dependents[] = [
                            'id' => $type,
                            'name' => $dependent->{"{$type}_name"},
                            'relation' => $type,
                            'status' => $dependent->$statusField ?? 'Active'
                        ];
                    }
                }
            }
            
            $employee->dependents = $dependents;
            return $employee;
        });

        return response()->json($employees);
    }

    public function create()
    {
        return Inertia::render('Employee/CreateEmployee');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_code' => 'required|string|unique:employee_master,employee_code',
            'full_name' => 'required|string',
            'gender' => 'required|string|in:Male,Female,Other',
            'whatsapp_number' => 'nullable|string|max:15',
            'department' => 'required|string',
            'category' => 'required|string|in:Kiran Hospital,Kiran Medical College,Kiran Nursing College,Kiran Medical College Student,Kiran Nursing College Student,Consultant',
            'is_active' => 'required|string|in:Active,Inactive,Hold,Notice',
            'effective_from' => 'required|date',
            'effective_till' => 'nullable|string',
            'self_dob' => 'required|date',
            'employee_photograph' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('employee_photograph')) {
            $file = $request->file('employee_photograph');
            $extension = $file->getClientOriginalExtension();
            $filepath = "{$validated['employee_code']}/photo.{$extension}";
            
            // Create directory if it doesn't exist
            Storage::disk('public')->makeDirectory($validated['employee_code']);
            
            // Store the file with custom path
            Storage::disk('public')->put($filepath, file_get_contents($file));
            $validated['employee_photograph'] = $filepath;
        }

        EmployeeMaster::create($validated);

        return redirect()->route('employee-master.index')
            ->with('message', 'Employee created successfully');
    }

    public function edit(EmployeeMaster $employee)
    {
        $employee->employee_photograph = $employee->employee_photograph 
            ? asset("storage/{$employee->employee_photograph}")
            : null;

        return Inertia::render('Employee/EditEmployee', [
            'employee' => $employee
        ]);
    }

    public function update(Request $request, EmployeeMaster $employee)
    {
        $validated = $request->validate([
            'employee_code' => 'required|string|unique:employee_master,employee_code,' . $employee->id,
            'full_name' => 'required|string',
            'gender' => 'required|string|in:Male,Female,Other',
            'whatsapp_number' => 'nullable|string|max:15',
            'department' => 'required|string',
            'category' => 'required|string|in:Kiran Hospital,Kiran Medical College,Kiran Nursing College,Kiran Medical College Student,Kiran Nursing College Student,Consultant',
            'is_active' => 'required|string|in:Active,Inactive,Hold,Notice',
            'effective_from' => 'required|date',
            'effective_till' => 'nullable|string',
            'self_dob' => 'required|date',
            'employee_photograph' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('employee_photograph')) {
            if ($employee->employee_photograph) {
                Storage::disk('public')->delete($employee->employee_photograph);
            }
            $path = $request->file('employee_photograph')->store('employees', 'public');
            $validated['employee_photograph'] = $path;
        } else {
            unset($validated['employee_photograph']);
        }

        $employee->update($validated);

        return redirect()->route('employee-master.index')
            ->with('message', 'Employee updated successfully');
    }

    public function search()
    {
        return Inertia::render('Employee/EmployeeSearch');
    }

    public function suggestions(Request $request)
    {
        $search = $request->input('search');
        
        return EmployeeMaster::where(function($query) use ($search) {
            $query->where('employee_code', 'like', "%{$search}%")
                  ->orWhere('full_name', 'like', "%{$search}%");
        })
        ->whereIn('is_active', ['Active', 'Hold', 'Notice'])
        ->select('id', 'employee_code', 'full_name', 'department', 'is_active', 'effective_from', 'self_dob', 'employee_photograph', 'category')
        ->limit(10)
        ->get()
        ->map(function($employee) {
            $employee->employee_photograph = $employee->employee_photograph 
                ? asset("storage/{$employee->employee_photograph}") 
                : null;
            return $employee;
        });
    }

    public function list()
    {
        $employees = EmployeeMaster::with('dependents')
            ->select(
                'id',
                'employee_code',
                'full_name',
                'department',
                'gender',
                'whatsapp_number',
                'is_active',
                'effective_from',
                'effective_till',
                'self_dob',
                'category',
            )->paginate(perPage: 10000000000);

        $employees->through(function ($employee) {
            $dependent = $employee->dependents;
            if ($dependent) {
                $employee->dependents = $dependent;
            }
            return $employee;
        });

        return Inertia::render('Employee/EmployeeList', [
            'employees' => $employees
        ]);
    }

    public function getAllDepartments()
    {
        $departments = EmployeeMaster::distinct()
            ->orderBy('department')
            ->pluck('department')
            ->filter()
            ->values();

        return response()->json($departments);
    }
}
