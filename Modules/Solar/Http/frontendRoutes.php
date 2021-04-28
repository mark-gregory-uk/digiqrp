<?php

use Illuminate\Routing\Router;
/** @var Router $router */


Route::get('/solar_data', 'PublicSolarDataController@index')->name('solar.data');
