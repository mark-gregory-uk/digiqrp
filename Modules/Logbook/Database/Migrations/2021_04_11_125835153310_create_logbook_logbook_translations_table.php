<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLogbookLogbookTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('logbook__logbook_translations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('logbook_id')->unsigned();
            $table->string('locale')->index();
            $table->string('title');
            $table->unique(['logbook_id', 'locale']);
            $table->foreign('logbook_id')->references('id')->on('logbook__logbooks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('logbook__logbook_translations', function (Blueprint $table) {
            $table->dropForeign(['logbook_id']);
        });
        Schema::dropIfExists('logbook__logbook_translations');
    }
}
