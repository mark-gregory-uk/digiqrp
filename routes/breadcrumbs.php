<?php
// Note: Laravel will automatically resolve `Breadcrumbs::` without
// this import. This is nice for IDE syntax and refactoring.

use Diglactic\Breadcrumbs\Breadcrumbs;

// This import is also not required, and you could replace `BreadcrumbTrail $trail`
//  with `$trail`. This is nice for IDE type checking and completion.
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;
use Illuminate\Support\Facades\Request;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Modules\Blog\Entities\PostTranslation;


// Home
Breadcrumbs::for('home', function (BreadcrumbTrail $trail) {
    $trail->push('Home', route('homepage'));
});

// Home > logbook
Breadcrumbs::for('logbook', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Logbook', route('homepage'));
});


// Home > Blog
Breadcrumbs::for('blog', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Blog Posts', route('homepage'));
});

// Home > posts
Breadcrumbs::for('posts', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Blog Posts', route('en.blog'));
});


// Home > development
Breadcrumbs::for('development', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Development', route('en.blog.category','development'));
});

// Home > about
Breadcrumbs::for('about', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('About', route('homepage'));
});

// Home > software
Breadcrumbs::for('software', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Software', route('en.blog.category','software'));
});

// Home > news
Breadcrumbs::for('news', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Site News', route('homepage'));
});

// Home > xeigu
Breadcrumbs::for('xeigu-g90', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Xeigu G90', route('homepage'));
});

// Home > contact-us
Breadcrumbs::for('contact-us', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Contact Us', route('homepage'));
});


// Home > logstats
Breadcrumbs::for('logstats', function (BreadcrumbTrail $trail) {
    $trail->parent('home');
    $trail->push('Regions Worked', route('homepage'));
});


// resolve the blog posts breadcrumbs
Breadcrumbs::for('post', function (BreadcrumbTrail $trail) {

    $post = PostTranslation::where('slug','=',basename(Request::url()))->first();

    if ($post){

        $sourcePost = \Modules\Blog\Entities\Post::where('id','=',$post->post_id)->first();

        if ($sourcePost->category_id){
            $category =  \Modules\Blog\Entities\Category::where('id','=',$sourcePost->category_id)->first()->name;
        }

        if ($sourcePost->category_only){
            if ($sourcePost->category_id == 21){
                $trail->parent('development');
            } else {
                $trail->parent('software');
            }

            $trail->push($post->title, route('en.blog.category',strtolower($category)));
        } else {
            $trail->parent('posts');
            $trail->push($post->title, route(LaravelLocalization::setLocale() ?: App::getLocale().'.blog'));
        }
    } else {
        $trail->parent(strtolower(basename(Request::url())));
    }

});
