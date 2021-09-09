<?php
// Note: Laravel will automatically resolve `Breadcrumbs::` without
// this import. This is nice for IDE syntax and refactoring.
use Diglactic\Breadcrumbs\Breadcrumbs;

// This import is also not required, and you could replace `BreadcrumbTrail $trail`
//  with `$trail`. This is nice for IDE type checking and completion.
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

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
    $trail->push('Blog Posts', route('homepage'));
});

// Home > Blog
Breadcrumbs::for('posts', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Blog Posts', route('en.blog'));
});


// Home > Blog
Breadcrumbs::for('software', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Software', route('homepage'));
});

Breadcrumbs::for('news', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Site News', route('homepage'));
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
    $trail->parent('posts');
    $post = \Modules\Blog\Entities\PostTranslation::where('slug','=',basename(Request::url()))->first();
    $trail->push($post->title, route(LaravelLocalization::setLocale() ?: App::getLocale().'.blog'));
});
