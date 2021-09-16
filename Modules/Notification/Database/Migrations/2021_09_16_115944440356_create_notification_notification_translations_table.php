<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationNotificationTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification__notification_translations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            // Your translatable fields

            $table->integer('notification_id')->unsigned();
            $table->string('locale')->index();
            $table->unique(['notification_id', 'locale']);
            $table->foreign('notification_id')->references('id')->on('notification__notifications')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notification__notification_translations', function (Blueprint $table) {
            $table->dropForeign(['notification_id']);
        });
        Schema::dropIfExists('notification__notification_translations');
    }
}
