<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSolarBandData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solar__banddata', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('day')->nullable();
            $table->string('day_condx')->nullable();
            $table->string('night')->nullable();
            $table->string('night_condx')->nullable();
            $table->integer('solar_id')->unsigned()->nullable();
            $table->foreign('solar_id')->references('id')->on('solar__reports')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('solar__banddata');
    }
}
