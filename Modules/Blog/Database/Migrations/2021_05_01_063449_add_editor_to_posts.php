<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEditorToPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (! Schema::hasColumn('blog__posts', 'editor_id')) {
            Schema::table('blog__posts', function (Blueprint $table) {
                $table->unsignedInteger('editor_id')->nullable();
                $table->foreign('editor_id')->references('id')->on('users');
            });
        }
    }
}
