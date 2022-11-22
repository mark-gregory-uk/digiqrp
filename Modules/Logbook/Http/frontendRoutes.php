<?php

Route::get('logentries', 'LogbookController@all')->name('logbook.all');
Route::get('logcountries', 'LogbookController@regions')->name('logbook.regions');
Route::get('logstats', 'LogbookController@stats')->name('logbook.stats');