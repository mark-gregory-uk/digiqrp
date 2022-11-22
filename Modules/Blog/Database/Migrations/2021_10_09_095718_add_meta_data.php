<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMetaData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        if (! Schema::hasColumn('blog__post_translations', 'meta_title')) {
            Schema::table('blog__post_translations', function (Blueprint $table) {
                $table->string('meta_title')->nullable();
            });
        }

        if (! Schema::hasColumn('blog__post_translations', 'meta_description')) {
            Schema::table('blog__post_translations', function (Blueprint $table) {
                $table->string('meta_description')->nullable();
            });
        }

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
