<?php

use Illuminate\Routing\Router;

/** @var Router $router */
$router->group(['prefix' => 'blog'], function (Router $router) {
    $locale = LaravelLocalization::setLocale() ?: App::getLocale();

    $router->get('posts', [
        'as'         => $locale.'.blog',
        'uses'       => 'PublicController@index',
        'middleware' => config('asgard.blog.config.middleware'),
    ]);
    $router->get('posts/{slug}', [
        'as'         => $locale.'.blog.slug',
        'uses'       => 'PublicController@show',
        'middleware' => config('asgard.blog.config.middleware'),
    ]);

    $router->get('posts/category/{cat}', [
        'as'         => $locale.'.blog.category',
        'uses'       => 'PublicController@byCategory',
        'middleware' => config('asgard.blog.config.middleware'),
    ]);
    $router->get('posts/category/{cat}/{slug}', [
        'as'         => $locale.'.blog.slugByCategory',
        'uses'       => 'PublicController@slugByCategory',
        'middleware' => config('asgard.blog.config.middleware'),
    ]);
});
