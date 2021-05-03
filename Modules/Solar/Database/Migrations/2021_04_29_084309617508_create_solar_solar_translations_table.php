<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSolarSolarTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('solar__reports_translations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('solar_id')->unsigned();
            $table->string('locale')->index();
            $table->unique(['solar_id', 'locale']);
            $table->foreign('solar_id')->references('id')->on('solar__reports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('solar__solar_translations', function (Blueprint $table) {
            $table->dropForeign(['solar_id']);
        });
        Schema::dropIfExists('solar__solar_translations');
    }
}
