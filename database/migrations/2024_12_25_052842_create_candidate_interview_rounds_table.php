<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_interview_rounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->integer('round_number');
            $table->string('interviewer_name');
            $table->enum('status', ['Pending', 'Selected', 'Rejected', 'On Hold', 'No Show'])->nullable()->default('Pending');
            $table->text('feedback')->nullable();
            $table->date('interview_date')->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_interview_rounds');
    }
}; 