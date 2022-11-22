<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSolarSolarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solar__reports', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('source')->nullable();
            $table->string('noise_level')->nullable();
            $table->string('last_updated')->nullable();

            $table->string('solarwind')->nullable();
            $table->string('aurora')->nullable();
            $table->string('aindex')->nullable();
            $table->string('kindex')->nullable();
            $table->string('xray')->nullable();
            $table->string('solarflux')->nullable();
            $table->string('heliumline')->nullable();
            $table->string('sunspots')->nullable();
            $table->string('protonflux')->nullable();
            $table->string('electonflux')->nullable();
            $table->string('magneticfield')->nullable();
            $table->string('kindexnt')->nullable();
            $table->string('normalization')->nullable();
            $table->string('latdegree')->nullable();
            $table->string('geomagfield')->nullable();
            $table->string('fof2')->nullable();
            $table->string('muffactor')->nullable();
            $table->string('muf')->nullable();

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
        Schema::dropIfExists('solar__reports');
    }
}
