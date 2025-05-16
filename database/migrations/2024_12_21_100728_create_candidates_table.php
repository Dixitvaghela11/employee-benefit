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
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->date('application_date')->useCurrent();
            $table->string('full_name', 100);
            $table->string('city', 50)->nullable();
            $table->foreignId('department_id')->constrained('departments');
            $table->string('position_applied', 100);
            $table->date('interview_date')->nullable();
            $table->string('education', 200)->nullable();
            $table->decimal('experience_years', 4, 2)->nullable();
            $table->string('current_organization', 100)->nullable();
            $table->string('contact_number', 15)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('referred_by', 100)->nullable();
            $table->enum('interview_status', [
                'Hold',
                'Observation',
                'Selected',
                'Shortlisted',
                'Rejected',
                'Pending'
            ])->default('Pending');
            $table->decimal('current_salary', 12, 2)->nullable();
            $table->decimal('expected_salary', 12, 2)->nullable();
            $table->decimal('offered_salary', 12, 2)->nullable();
            $table->enum('final_status', [
                'Hold',
                'Joined',
                'Not Interested',
                'Observation',
                'Offer Rejected',
                'Offered',
                'Rejected',
                'Selected'
            ])->default('Hold');
            $table->text('remarks')->nullable();
            $table->foreignId('created_by_user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->foreignId('updated_by_user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
}; 