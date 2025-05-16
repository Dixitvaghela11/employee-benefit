<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('employee_master', function (Blueprint $table) {
        $table->enum('is_active', ['Active', 'Inactive', 'Hold', 'Notice'])->default('Active')->change();
    });
}

public function down()
{
    Schema::table('employee_master', function (Blueprint $table) {
        $table->boolean('is_active')->change();
    });
}
};
