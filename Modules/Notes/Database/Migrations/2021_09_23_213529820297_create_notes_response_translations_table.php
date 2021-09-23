<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotesResponseTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notes__response_translations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            // Your translatable fields

            $table->integer('response_id')->unsigned();
            $table->string('locale')->index();
            $table->unique(['response_id', 'locale']);
            $table->foreign('response_id')->references('id')->on('notes__responses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notes__response_translations', function (Blueprint $table) {
            $table->dropForeign(['response_id']);
        });
        Schema::dropIfExists('notes__response_translations');
    }
}
