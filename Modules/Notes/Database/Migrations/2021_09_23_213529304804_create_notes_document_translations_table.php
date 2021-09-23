<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotesDocumentTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notes__document_translations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            // Your translatable fields

            $table->integer('document_id')->unsigned();
            $table->string('locale')->index();
            $table->unique(['document_id', 'locale']);
            $table->foreign('document_id')->references('id')->on('notes__documents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notes__document_translations', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
        });
        Schema::dropIfExists('notes__document_translations');
    }
}
