<?php

use Illuminate\Routing\Router;
/** @var Router $router */

$router->group(['prefix' =>'/notes'], function (Router $router) {
    $router->bind('document', function ($id) {
        return app('Modules\Notes\Repositories\DocumentRepository')->find($id);
    });
    $router->get('documents', [
        'as' => 'admin.notes.document.index',
        'uses' => 'DocumentController@index',
        'middleware' => 'can:notes.documents.index'
    ]);
    $router->get('documents/create', [
        'as' => 'admin.notes.document.create',
        'uses' => 'DocumentController@create',
        'middleware' => 'can:notes.documents.create'
    ]);
    $router->post('documents', [
        'as' => 'admin.notes.document.store',
        'uses' => 'DocumentController@store',
        'middleware' => 'can:notes.documents.create'
    ]);
    $router->get('documents/{document}/edit', [
        'as' => 'admin.notes.document.edit',
        'uses' => 'DocumentController@edit',
        'middleware' => 'can:notes.documents.edit'
    ]);
    $router->put('documents/{document}', [
        'as' => 'admin.notes.document.update',
        'uses' => 'DocumentController@update',
        'middleware' => 'can:notes.documents.edit'
    ]);
    $router->delete('documents/{document}', [
        'as' => 'admin.notes.document.destroy',
        'uses' => 'DocumentController@destroy',
        'middleware' => 'can:notes.documents.destroy'
    ]);
    $router->bind('response', function ($id) {
        return app('Modules\Notes\Repositories\ResponseRepository')->find($id);
    });
    $router->get('responses', [
        'as' => 'admin.notes.response.index',
        'uses' => 'ResponseController@index',
        'middleware' => 'can:notes.responses.index'
    ]);
    $router->get('responses/create', [
        'as' => 'admin.notes.response.create',
        'uses' => 'ResponseController@create',
        'middleware' => 'can:notes.responses.create'
    ]);
    $router->post('responses', [
        'as' => 'admin.notes.response.store',
        'uses' => 'ResponseController@store',
        'middleware' => 'can:notes.responses.create'
    ]);
    $router->get('responses/{response}/edit', [
        'as' => 'admin.notes.response.edit',
        'uses' => 'ResponseController@edit',
        'middleware' => 'can:notes.responses.edit'
    ]);
    $router->put('responses/{response}', [
        'as' => 'admin.notes.response.update',
        'uses' => 'ResponseController@update',
        'middleware' => 'can:notes.responses.edit'
    ]);
    $router->delete('responses/{response}', [
        'as' => 'admin.notes.response.destroy',
        'uses' => 'ResponseController@destroy',
        'middleware' => 'can:notes.responses.destroy'
    ]);
    $router->bind('responsetoresponse', function ($id) {
        return app('Modules\Notes\Repositories\ResponseToResponseRepository')->find($id);
    });
    $router->get('responsetoresponses', [
        'as' => 'admin.notes.responsetoresponse.index',
        'uses' => 'ResponseToResponseController@index',
        'middleware' => 'can:notes.responsetoresponses.index'
    ]);
    $router->get('responsetoresponses/create', [
        'as' => 'admin.notes.responsetoresponse.create',
        'uses' => 'ResponseToResponseController@create',
        'middleware' => 'can:notes.responsetoresponses.create'
    ]);
    $router->post('responsetoresponses', [
        'as' => 'admin.notes.responsetoresponse.store',
        'uses' => 'ResponseToResponseController@store',
        'middleware' => 'can:notes.responsetoresponses.create'
    ]);
    $router->get('responsetoresponses/{responsetoresponse}/edit', [
        'as' => 'admin.notes.responsetoresponse.edit',
        'uses' => 'ResponseToResponseController@edit',
        'middleware' => 'can:notes.responsetoresponses.edit'
    ]);
    $router->put('responsetoresponses/{responsetoresponse}', [
        'as' => 'admin.notes.responsetoresponse.update',
        'uses' => 'ResponseToResponseController@update',
        'middleware' => 'can:notes.responsetoresponses.edit'
    ]);
    $router->delete('responsetoresponses/{responsetoresponse}', [
        'as' => 'admin.notes.responsetoresponse.destroy',
        'uses' => 'ResponseToResponseController@destroy',
        'middleware' => 'can:notes.responsetoresponses.destroy'
    ]);
// append



});
