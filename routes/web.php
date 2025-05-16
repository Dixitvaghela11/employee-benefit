<?php

use App\Http\Controllers\EmployeeMasterController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmployeeDependentController;
use App\Http\Controllers\CandidateController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DepartmentController;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Employee Master
    Route::get('/employee-master', [EmployeeMasterController::class, 'index'])->name('employee-master.index');
    Route::get('/employee-master/create', [EmployeeMasterController::class, 'create'])->name('employee-master.create');
    Route::post('/employee-master', [EmployeeMasterController::class, 'store'])->name('employee-master.store');
    Route::get('/employee-master/filter', [EmployeeMasterController::class, 'filter'])->name('employee-master.filter');
    Route::get('/employee-dependents/{employee}', [EmployeeDependentController::class, 'show'])
        ->name('employee-dependents.show');
    Route::post('/employee-dependents/{employee}', [EmployeeDependentController::class, 'store'])
        ->name('employee-dependents.store');

    Route::post('/employee-dependents/{employee}/save', [EmployeeDependentController::class, 'saveDependents'])
        ->name('employee-dependents.save');

    Route::get('/employee-master/{employee}/edit', [EmployeeMasterController::class, 'edit'])->name('employee-master.edit');
    Route::put('/employee-master/{employee}', [EmployeeMasterController::class, 'update'])->name('employee-master.update');

    Route::get('/employee-search', [EmployeeMasterController::class, 'search'])->name('employee-search');
    Route::get('/employee-search/suggestions', [EmployeeMasterController::class, 'suggestions'])->name('employee-search.suggestions');

    Route::get('/employee-details/{employee}', [EmployeeDependentController::class, 'getEmployeeDetails'])
        ->name('employee-details.get');

    Route::get('/export-data', [EmployeeMasterController::class, 'list'])->name('employee.list');

    Route::get('/api/employees/filter', [EmployeeMasterController::class, 'filter']);

    Route::get('/api/departments', [EmployeeMasterController::class, 'getAllDepartments']);

    
    Route::get('/departments/create', [DepartmentController::class, 'create'])->name('departments.create');
    Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');

});


// Resume Tracker -----------
Route::middleware(['auth'])->group(function () {
    Route::get('/api/departments/list', [CandidateController::class, 'getDepartments'])->name('api.departments.list');
    Route::get('/candidates/filter', [CandidateController::class, 'filter']);
    Route::get('/candidates/export', [CandidateController::class, 'export'])->name('candidates.export');
    Route::resource('candidates', CandidateController::class);
});

require __DIR__ . '/auth.php';
