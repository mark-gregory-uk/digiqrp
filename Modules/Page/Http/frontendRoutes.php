<?php

use Illuminate\Routing\Router;
// Note: Laravel will automatically resolve `Breadcrumbs::` without
// this import. This is nice for IDE syntax and refactoring.
use Diglactic\Breadcrumbs\Breadcrumbs;

// This import is also not required, and you could replace `BreadcrumbTrail $trail`
//  with `$trail`. This is nice for IDE type checking and completion.
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;



/** @var Router $router */
$router->get('/', [
    'uses' => 'PublicController@homepage',
    'as' => 'homepage',
    'middleware' => config('asgard.page.config.middleware'),
]);
$router->any('{uri}', [
    'uses' => 'PublicController@uri',
    'as' => 'page',
    'middleware' => config('asgard.page.config.middleware'),
])->where('uri', '.*');



// Home
Breadcrumbs::for('home', function (BreadcrumbTrail $trail) {
    $trail->push('Home', route('homepage'));
});

// Home > Blog
Breadcrumbs::for('logbook', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Logbook', route('homepage'));
});


// Home > Blog
Breadcrumbs::for('blog', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Blog', route('homepage'));
});

// Home > Blog
Breadcrumbs::for('software', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Software', route('homepage'));
});

Breadcrumbs::for('xeigu-g90', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Xeigu G90', route('homepage'));
});

Breadcrumbs::for('contact-us', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Contact Us', route('homepage'));
});

Breadcrumbs::for('about', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('About', route('homepage'));
});

Breadcrumbs::for('logstats', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Regions Worked', route('homepage'));
});

Breadcrumbs::for('post', function (BreadcrumbTrail $trail) {
    $trail->parent('blog');
    $post = \Modules\Blog\Entities\PostTranslation::where('slug','=',basename(Request::url()))->first();
    $trail->push($post->title, route(LaravelLocalization::setLocale() ?: App::getLocale().'.blog'));
});
