<?php

use Illuminate\Routing\Router;

/** @var Router $router */
$router->group(['prefix' =>'/download'], function (Router $router) {
    $router->bind('download', function ($id) {
        return app('Modules\Download\Repositories\DownloadRepository')->find($id);
    });
    $router->get('downloads', [
        'as' => 'admin.download.download.index',
        'uses' => 'DownloadController@index',
        'middleware' => 'can:download.downloads.index',
    ]);
    $router->get('downloads/create', [
        'as' => 'admin.download.download.create',
        'uses' => 'DownloadController@create',
        'middleware' => 'can:download.downloads.create',
    ]);
    $router->post('downloads', [
        'as' => 'admin.download.download.store',
        'uses' => 'DownloadController@store',
        'middleware' => 'can:download.downloads.create',
    ]);
    $router->get('downloads/{download}/edit', [
        'as' => 'admin.download.download.edit',
        'uses' => 'DownloadController@edit',
        'middleware' => 'can:download.downloads.edit',
    ]);
    $router->put('downloads/{download}', [
        'as' => 'admin.download.download.update',
        'uses' => 'DownloadController@update',
        'middleware' => 'can:download.downloads.edit',
    ]);
    $router->delete('downloads/{download}', [
        'as' => 'admin.download.download.destroy',
        'uses' => 'DownloadController@destroy',
        'middleware' => 'can:download.downloads.destroy',
    ]);
    // append
});
