<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function create()
    {
        return Inertia::render('ResumeTracker/CreateDepartment');
    }

    public function store(Request $request)
    {
        $request->validate([
            'department_name' => 'required|string|max:255|unique:departments,department_name',
        ]);

        Department::create([
            'department_name' => $request->department_name,
            'is_active' => true,
        ]);

        return redirect()->route('candidates.index')
            ->with('message', 'Department created successfully');
    }
} 