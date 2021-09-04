<?php

Route::get('logentries', 'LogbookController@all')->name('logbook.all');
Route::get('logcountries', 'LogbookController@status')->name('logbook.status');