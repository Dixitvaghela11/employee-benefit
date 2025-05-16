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
        Schema::create('employee_master', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->unique();
            $table->string('full_name');
            $table->string('department');
            $table->enum('is_active', ['Active', 'Inactive', 'Hold', 'Notice'])->default('Active');
            $table->date('effective_from');
            $table->string('effective_till')->default('Till Employee');
            $table->date('self_dob');
            $table->decimal('deduction', 10, 2)->default(0);
            $table->decimal('10rs', 10, 2)->default(0);
            $table->decimal('50rs', 10, 2)->default(0);
            $table->decimal('30rs', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->string('employee_photograph')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_master');
    }
};
