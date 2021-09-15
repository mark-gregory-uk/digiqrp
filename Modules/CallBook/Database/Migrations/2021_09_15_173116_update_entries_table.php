<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('callbook__entries', function (Blueprint $table) {
            $table->longText('qth')->nullable();
            $table->longText('adr_zip')->nullable();
            $table->longText('district')->nullable();
            $table->longText('us_state')->nullable();
            $table->longText('us_zone')->nullable();
            $table->longText('oblast')->nullable();
            $table->longText('dok')->nullable();
            $table->longText('qsl_via')->nullable();
            $table->longText('jabber')->nullable();
            $table->longText('icq')->nullable();
            $table->longText('msn')->nullable();
            $table->longText('skype')->nullable();
            $table->longText('birth_year')->nullable();
            $table->longText('lic_tear')->nullable();
            $table->longText('facebook')->nullable();
            $table->longText('twitter')->nullable();
            $table->longText('youtube')->nullable();
            $table->longText('gplus')->nullable();
            $table->longText('linkedin')->nullable();
            $table->longText('flicker')->nullable();
            $table->longText('vimeo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('', function (Blueprint $table) {

        });
    }
}
