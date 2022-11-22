<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogBookEntriesTable extends Migration
{
    /**
     * Run the migration to create logbook entries.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('logbook__entries', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('parent_id')->unsigned()->nullable();
            $table->foreign('parent_id')->references('id')->on('logbook__logbooks')->onDelete('cascade');
            $table->string('call')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('street')->nullable();
            $table->string('city')->nullable();
            $table->string('county')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_country')->nullable();
            $table->string('zip')->nullable();
            $table->string('grid')->nullable();
            $table->string('dxcc_country')->nullable();
            $table->string('iota')->nullable();
            $table->string('sota')->nullable();
            $table->string('cq_zone')->nullable();
            $table->string('itu')->nullable();
            $table->string('email')->nullable();
            $table->string('url')->nullable();
            $table->string('mode')->nullable();
            $table->string('band_rx')->nullable();
            $table->string('band_tx')->nullable();
            $table->string('rst_sent')->nullable();
            $table->string('rst_received')->nullable();
            $table->string('qsl_via')->nullable();
            $table->string('azimuth')->nullable();
            $table->string('elevation')->nullable();
            $table->string('power')->nullable();
            $table->string('srx_numeric')->nullable();
            $table->string('stx_numeric')->nullable();
            $table->string('dxcc_id')->nullable();
            $table->string('contest_id')->nullable();
            $table->string('skcc')->nullable();
            $table->double('lat')->nullable();
            $table->double('lng')->nullable();
            $table->double('tx_frequency')->nullable();
            $table->double('rx_frequency')->nullable();
            $table->dateTime('qsl_sent')->nullable();
            $table->dateTime('qso_start')->nullable();
            $table->dateTime('qso_end')->nullable();
            $table->dateTime('qsl_received')->nullable();
            $table->dateTime('qsl_done')->nullable();
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
        Schema::dropIfExists('logbook__entries');
    }
}
