<?php

use Illuminate\Routing\Router;


Route::get('logentries', 'LogbookController@all')->name('logbook.all');
