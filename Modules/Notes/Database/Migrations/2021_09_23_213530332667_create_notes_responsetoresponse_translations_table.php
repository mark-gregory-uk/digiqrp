<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotesResponseToResponseTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notes__responsetoresponse_translations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            // Your translatable fields

            $table->integer('responsetoresponse_id')->unsigned();
            $table->string('locale')->index();
            $table->unique(['responsetoresponse_id', 'locale']);
            $table->foreign('responsetoresponse_id')->references('id')->on('notes__responsetoresponses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notes__responsetoresponse_translations', function (Blueprint $table) {
            $table->dropForeign(['responsetoresponse_id']);
        });
        Schema::dropIfExists('notes__responsetoresponse_translations');
    }
}
