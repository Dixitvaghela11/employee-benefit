<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_dependent_master', function (Blueprint $table) {
            $table->dropColumn([
                'spouse_age',
                'dependent1_age',
                'dependent2_age',
                'father_age',
                'mother_age',
                'additional_dependent1_age',
                'additional_dependent2_age',
                'additional_dependent3_age'
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('employee_dependent_master', function (Blueprint $table) {
            $table->integer('spouse_age')->nullable();
            $table->integer('dependent1_age')->nullable();
            $table->integer('dependent2_age')->nullable();
            $table->integer('father_age')->nullable();
            $table->integer('mother_age')->nullable();
            $table->integer('additional_dependent1_age')->nullable();
            $table->integer('additional_dependent2_age')->nullable();
            $table->integer('additional_dependent3_age')->nullable();
        });
    }
}; 