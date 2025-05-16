<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employee_master', function (Blueprint $table) {
            // Drop the columns
            $table->dropColumn([
                'deduction',
                '10rs',
                '50rs',
                '30rs',
                'total'
            ]);

            // Add new category column
            $table->string('category')->nullable()->after('department');
        });
    }

    public function down(): void
    {
        Schema::table('employee_master', function (Blueprint $table) {
            // Recreate the dropped columns
            $table->decimal('deduction', 10, 2)->default(0);
            $table->decimal('10rs', 10, 2)->default(0);
            $table->decimal('50rs', 10, 2)->default(0);
            $table->decimal('30rs', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);

            // Remove the category column
            $table->dropColumn('category');
        });
    }
}; 