<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

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
            // Your translatable fields

            $table->integer('logbook_id')->unsigned();
            $table->string('locale')->index();
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
