<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateLogsTable extends Migration
{
    /**
     * Add the default field to the logbook table.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('logbook__logbooks', function (Blueprint $table) {
            $table->boolean('default')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('logbook__logbooks', function (Blueprint $table) {
            $table->dropColumn('default');
        });
    }
}
