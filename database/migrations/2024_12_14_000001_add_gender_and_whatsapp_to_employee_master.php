<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_master', function (Blueprint $table) {
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable()->after('full_name');
            $table->string('whatsapp_number')->nullable()->after('gender');
        });
    }

    public function down(): void
    {
        Schema::table('employee_master', function (Blueprint $table) {
            $table->dropColumn(['gender', 'whatsapp_number']);
        });
    }
}; 