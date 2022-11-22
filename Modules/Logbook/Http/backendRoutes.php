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
    $router->get('logbooks/{logbook}/view', [
        'as'         => 'admin.logbook.logbook.view',
        'uses'       => 'LogbookController@view',
        'middleware' => 'can:logbook.logbooks.view',
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

    $router->get('entry/{entry}/edit', [
        'as'         => 'admin.logbook.entry.edit',
        'uses'       => 'LogBookEntryController@edit',
        //'middleware' => 'can:logbook.countries.edit',
    ]);
    $router->put('entry/{entry}', [
        'as'         => 'admin.logbook.entry.update',
        'uses'       => 'LogBookEntryController@update',
        //'middleware' => 'can:logbook.logbooks.edit',
    ]);

    // Countries

    $router->get('countries', [
        'as'         => 'admin.logbook.countries.index',
        'uses'       => 'LogBookCountryController@index',
        'middleware' => 'can:logbook.countries.index',
    ]);

    $router->get('countries/create', [
        'as'         => 'admin.logbook.countries.create',
        'uses'       => 'LogBookCountryController@create',
        'middleware' => 'can:logbook.logbooks.create',
    ]);
    $router->post('countries', [
        'as'         => 'admin.logbook.countries.store',
        'uses'       => 'LogBookCountryController@store',
        'middleware' => 'can:logbook.countries.create',
    ]);
    $router->get('countries/{logbookCountry}/edit', [
        'as'         => 'admin.logbook.country.edit',
        'uses'       => 'LogBookCountryController@edit',
        'middleware' => 'can:logbook.countries.edit',
    ]);
    $router->put('countries/{logbookCountry}', [
        'as'         => 'admin.logbook.countries.update',
        'uses'       => 'LogBookCountryController@update',
        'middleware' => 'can:logbook.countries.edit',
    ]);
    $router->delete('countries/{logbookCountry}', [
        'as'         => 'admin.logbook.country.destroy',
        'uses'       => 'LogBookCountryController@destroy',
        'middleware' => 'can:logbook.countries.destroy',
    ]);

    // Logentries

    Route::get('/upload-file/{owner}/{logbook}', [\Modules\Logbook\Http\Controllers\Admin\LogbookController::class, 'createForm'])->name('logbook.upload');
    Route::post('/upload-file/{owner}/{logbook}', [\Modules\Logbook\Http\Controllers\Admin\LogbookController::class, 'fileUpload'])->name('logbook.uploadlog');

    // ADIF Files
    Route::post('/upload-adif/{owner}/{logbook}', [\Modules\Logbook\Http\Controllers\Admin\LogbookController::class, 'adifUpload'])->name('logbook.uploadadif');

});
