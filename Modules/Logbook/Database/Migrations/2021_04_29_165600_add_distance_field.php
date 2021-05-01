<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDistanceField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('logbook__entries', function (Blueprint $table) {
            $table->float('distance_km')->nullable();
            $table->float('distance_miles')->nullable();
        });
    }
}
