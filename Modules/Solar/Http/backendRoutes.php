<?php

use Illuminate\Routing\Router;
/** @var Router $router */

$router->group(['prefix' =>'/solar'], function (Router $router) {
    $router->bind('solardata', function ($id) {
        return app('Modules\Solar\Repositories\SolarDataRepository')->find($id);
    });
    $router->get('solardatas', [
        'as' => 'admin.solar.solardata.index',
        'uses' => 'SolarDataController@index',
        'middleware' => 'can:solar.solardatas.index'
    ]);
    $router->get('solardatas/create', [
        'as' => 'admin.solar.solardata.create',
        'uses' => 'SolarDataController@create',
        'middleware' => 'can:solar.solardatas.create'
    ]);
    $router->post('solardatas', [
        'as' => 'admin.solar.solardata.store',
        'uses' => 'SolarDataController@store',
        'middleware' => 'can:solar.solardatas.create'
    ]);
    $router->get('solardatas/{solardata}/edit', [
        'as' => 'admin.solar.solardata.edit',
        'uses' => 'SolarDataController@edit',
        'middleware' => 'can:solar.solardatas.edit'
    ]);
    $router->put('solardatas/{solardata}', [
        'as' => 'admin.solar.solardata.update',
        'uses' => 'SolarDataController@update',
        'middleware' => 'can:solar.solardatas.edit'
    ]);
    $router->delete('solardatas/{solardata}', [
        'as' => 'admin.solar.solardata.destroy',
        'uses' => 'SolarDataController@destroy',
        'middleware' => 'can:solar.solardatas.destroy'
    ]);
// append

});
