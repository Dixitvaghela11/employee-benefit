<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_dependent_master', function (Blueprint $table) {
            $table->enum('spouse_status', ['Active', 'Inactive'])->default('Active')->after('spouse_photograph');
            $table->enum('dependent1_status', ['Active', 'Inactive'])->default('Active')->after('dependent1_photograph');
            $table->enum('dependent2_status', ['Active', 'Inactive'])->default('Active')->after('dependent2_photograph');
            $table->enum('additional_dependent1_status', ['Active', 'Inactive'])->default('Active')->after('additional_dependent1_photograph');
            $table->enum('additional_dependent2_status', ['Active', 'Inactive'])->default('Active')->after('additional_dependent2_photograph');
            $table->enum('father_status', ['Active', 'Inactive'])->default('Active')->after('father_photograph');
            $table->enum('mother_status', ['Active', 'Inactive'])->default('Active')->after('mother_photograph');
            $table->enum('additional_dependent3_status', ['Active', 'Inactive'])->default('Active')->after('additional_dependent3_photograph');
        });
    }

    public function down(): void
    {
        Schema::table('employee_dependent_master', function (Blueprint $table) {
            $table->dropColumn([
                'spouse_status',
                'dependent1_status',
                'dependent2_status',
                'additional_dependent1_status',
                'additional_dependent2_status',
                'father_status',
                'mother_status',
                'additional_dependent3_status',
            ]);
        });
    }
}; 