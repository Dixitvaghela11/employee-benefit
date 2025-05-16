<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employee_dependent_master', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('employee_master');
            
            // Spouse
            $table->string('spouse_name')->nullable();
            $table->date('spouse_dob')->nullable();
            $table->integer('spouse_age')->nullable();
            $table->string('spouse_photograph')->nullable();
            
            // Dependent 1
            $table->string('dependent1_name')->nullable();
            $table->date('dependent1_dob')->nullable();
            $table->integer('dependent1_age')->nullable();
            $table->string('dependent1_photograph')->nullable();
            
            // Dependent 2
            $table->string('dependent2_name')->nullable();
            $table->date('dependent2_dob')->nullable();
            $table->integer('dependent2_age')->nullable();
            $table->string('dependent2_photograph')->nullable();
            
            // Additional Dependent 1
            $table->string('additional_dependent1_name')->nullable();
            $table->date('additional_dependent1_dob')->nullable();
            $table->integer('additional_dependent1_age')->nullable();
            $table->string('additional_dependent1_photograph')->nullable();
            
            // Additional Dependent 2
            $table->string('additional_dependent2_name')->nullable();
            $table->date('additional_dependent2_dob')->nullable();
            $table->integer('additional_dependent2_age')->nullable();
            $table->string('additional_dependent2_photograph')->nullable();
            
            // Father
            $table->string('father_name')->nullable();
            $table->date('father_dob')->nullable();
            $table->integer('father_age')->nullable();
            $table->string('father_photograph')->nullable();
            
            // Mother
            $table->string('mother_name')->nullable();
            $table->date('mother_dob')->nullable();
            $table->integer('mother_age')->nullable();
            $table->string('mother_photograph')->nullable();
            
            // Additional Dependent 3
            $table->string('additional_dependent3_name')->nullable();
            $table->date('additional_dependent3_dob')->nullable();
            $table->integer('additional_dependent3_age')->nullable();
            $table->string('additional_dependent3_photograph')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_dependants');
    }
};
