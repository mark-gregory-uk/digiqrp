<?php

use Illuminate\Routing\Router;
/** @var Router $router */

$router->group(['prefix' =>'/blog'], function (Router $router) {
    $router->bind('post', function ($id) {
        return app('Modules\Blog\Repositories\PostRepository')->find($id);
    });
    $router->get('posts', [
        'as' => 'admin.blog.post.index',
        'uses' => 'PostController@index',
        'middleware' => 'can:blog.posts.index'
    ]);
    $router->get('posts/create', [
        'as' => 'admin.blog.post.create',
        'uses' => 'PostController@create',
        'middleware' => 'can:blog.posts.create'
    ]);
    $router->post('posts', [
        'as' => 'admin.blog.post.store',
        'uses' => 'PostController@store',
        'middleware' => 'can:blog.posts.create'
    ]);
    $router->get('posts/{post}/edit', [
        'as' => 'admin.blog.post.edit',
        'uses' => 'PostController@edit',
        'middleware' => 'can:blog.posts.edit'
    ]);
    $router->put('posts/{post}', [
        'as' => 'admin.blog.post.update',
        'uses' => 'PostController@update',
        'middleware' => 'can:blog.posts.edit'
    ]);
    $router->delete('posts/{post}', [
        'as' => 'admin.blog.post.destroy',
        'uses' => 'PostController@destroy',
        'middleware' => 'can:blog.posts.destroy'
    ]);
// append

});
