<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCategoryOnlyToPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (! Schema::hasColumn('blog__posts', 'category_only')) {
            Schema::table('blog__posts', function (Blueprint $table) {
                $table->boolean('category_only')->default(false);
            });
        }
    }
}
