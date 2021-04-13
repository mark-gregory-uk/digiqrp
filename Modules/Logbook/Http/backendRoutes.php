<?php

use Illuminate\Routing\Router;

/** @var Router $router */
$router->group(['prefix' =>'/logbook'], function (Router $router) {
    $router->bind('logbook', function ($id) {
        return app('Modules\Logbook\Repositories\LogbookRepository')->find($id);
    });
    $router->get('logbooks', [
        'as'         => 'admin.logbook.logbook.index',
        'uses'       => 'LogbookController@index',
        'middleware' => 'can:logbook.logbooks.index',
    ]);
    $router->get('logbooks/create', [
        'as'         => 'admin.logbook.logbook.create',
        'uses'       => 'LogbookController@create',
        'middleware' => 'can:logbook.logbooks.create',
    ]);
    $router->post('logbooks', [
        'as'         => 'admin.logbook.logbook.store',
        'uses'       => 'LogbookController@store',
        'middleware' => 'can:logbook.logbooks.create',
    ]);
    $router->get('logbooks/{logbook}/edit', [
        'as'         => 'admin.logbook.logbook.edit',
        'uses'       => 'LogbookController@edit',
        'middleware' => 'can:logbook.logbooks.edit',
    ]);
    $router->put('logbooks/{logbook}', [
        'as'         => 'admin.logbook.logbook.update',
        'uses'       => 'LogbookController@update',
        'middleware' => 'can:logbook.logbooks.edit',
    ]);
    $router->delete('logbooks/{logbook}', [
        'as'         => 'admin.logbook.logbook.destroy',
        'uses'       => 'LogbookController@destroy',
        'middleware' => 'can:logbook.logbooks.destroy',
    ]);
    // append
});
