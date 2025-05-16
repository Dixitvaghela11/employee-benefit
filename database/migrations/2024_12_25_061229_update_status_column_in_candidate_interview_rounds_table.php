<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('candidate_interview_rounds', function (Blueprint $table) {
            // First, drop the existing column
            $table->dropColumn('status');
        });

        Schema::table('candidate_interview_rounds', function (Blueprint $table) {
            // Then, recreate it with the new definition
            $table->enum('status', ['Pending', 'Selected', 'Rejected', 'On Hold', 'No Show'])->nullable()->default('Pending');
        });
    }

    public function down(): void
    {
        Schema::table('candidate_interview_rounds', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->enum('status', ['Pending', 'Selected', 'Rejected', 'On Hold', 'No Show'])->default('Pending');
        });
    }
}; 