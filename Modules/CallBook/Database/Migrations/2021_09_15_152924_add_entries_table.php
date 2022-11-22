<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEntriesTable extends Migration
{
    /**
     * Run the migration to create logbook entries.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('callbook__entries', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('callsign')->nullable();
            $table->string('nick')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('country')->nullable();
            $table->string('adif')->nullable();
            $table->string('cq')->nullable();
            $table->string('grid')->nullable();
            $table->string('adr_name')->nullable();
            $table->string('adr_street1')->nullable();
            $table->string('adr_street2')->nullable();
            $table->string('adr_street3')->nullable();
            $table->string('adr_city')->nullable();
            $table->string('adr_country')->nullable();
            $table->string('adr_adif')->nullable();
            $table->string('lotw')->nullable();
            $table->string('qsldirect')->nullable();
            $table->string('qsl')->nullable();
            $table->string('eqsl')->nullable();
            $table->string('email')->nullable();
            $table->string('continent')->nullable();
            $table->string('utc_offset')->nullable();
            $table->longText('picture')->nullable();
            $table->string('sota')->nullable();
            $table->string('cq_zone')->nullable();
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
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
        Schema::dropIfExists('callbook__entries');
    }
}
