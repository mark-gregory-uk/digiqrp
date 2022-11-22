<?php

Route::get('sunspots', 'SolarController@sunspots')->name('solar.sunspots');
Route::get('magnaticfield', 'SolarController@magneticField')->name('solar.magneticfield');
