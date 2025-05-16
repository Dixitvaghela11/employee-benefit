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
        Schema::create('candidate_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')
                  ->constrained('candidates')
                  ->onDelete('cascade');
            $table->foreignId('category_id')
                  ->constrained('document_categories')
                  ->onDelete('restrict');
            $table->string('document_name', 100);
            $table->string('original_filename', 255);
            $table->string('file_path', 500);
            $table->string('file_type', 10);
            $table->timestamp('upload_datetime')->useCurrent();
            $table->foreignId('uploaded_by_user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->timestamp('verified_datetime')->nullable();
            $table->foreignId('verified_by_user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_documents');
    }
}; 