<?php

use Illuminate\Routing\Router;
/** @var Router $router */

$router->group(['prefix' =>'/notification'], function (Router $router) {
    $router->bind('notification', function ($id) {
        return app('Modules\Notification\Repositories\NotificationRepository')->find($id);
    });
    $router->get('notifications', [
        'as' => 'admin.notification.notification.index',
        'uses' => 'NotificationController@index',
        'middleware' => 'can:notification.notifications.index'
    ]);
    $router->get('notifications/create', [
        'as' => 'admin.notification.notification.create',
        'uses' => 'NotificationController@create',
        'middleware' => 'can:notification.notifications.create'
    ]);
    $router->post('notifications', [
        'as' => 'admin.notification.notification.store',
        'uses' => 'NotificationController@store',
        'middleware' => 'can:notification.notifications.create'
    ]);
    $router->get('notifications/{notification}/edit', [
        'as' => 'admin.notification.notification.edit',
        'uses' => 'NotificationController@edit',
        'middleware' => 'can:notification.notifications.edit'
    ]);
    $router->put('notifications/{notification}', [
        'as' => 'admin.notification.notification.update',
        'uses' => 'NotificationController@update',
        'middleware' => 'can:notification.notifications.edit'
    ]);
    $router->delete('notifications/{notification}', [
        'as' => 'admin.notification.notification.destroy',
        'uses' => 'NotificationController@destroy',
        'middleware' => 'can:notification.notifications.destroy'
    ]);
// append

});
