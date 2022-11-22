<?php

use Illuminate\Routing\Router;

/** @var Router $router */
$router->group(['prefix' =>'/solar'], function (Router $router) {
    $router->bind('solar', function ($id) {
        return app('Modules\Solar\Repositories\SolarRepository')->find($id);
    });
    $router->get('solars', [
        'as' => 'admin.solar.solar.index',
        'uses' => 'SolarController@index',
        'middleware' => 'can:solar.solars.index',
    ]);
    $router->get('solars/create', [
        'as' => 'admin.solar.solar.create',
        'uses' => 'SolarController@create',
        'middleware' => 'can:solar.solars.create',
    ]);
    $router->post('solars', [
        'as' => 'admin.solar.solar.store',
        'uses' => 'SolarController@store',
        'middleware' => 'can:solar.solars.create',
    ]);
    $router->get('solars/{solar}/edit', [
        'as' => 'admin.solar.solar.edit',
        'uses' => 'SolarController@edit',
        'middleware' => 'can:solar.solars.edit',
    ]);
    $router->put('solars/{solar}', [
        'as' => 'admin.solar.solar.update',
        'uses' => 'SolarController@update',
        'middleware' => 'can:solar.solars.edit',
    ]);
    $router->delete('solars/{solar}', [
        'as' => 'admin.solar.solar.destroy',
        'uses' => 'SolarController@destroy',
        'middleware' => 'can:solar.solars.destroy',
    ]);
    // append
});
