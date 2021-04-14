<?php

namespace Modules\Blog\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Blog\Entities\Category;
use Modules\Blog\Entities\Post;
use Modules\Blog\Listeners\RegisterBlogSidebar;
use Modules\Blog\Repositories\Cache\CacheCategoryDecorator;
use Modules\Blog\Repositories\Cache\CachePostDecorator;
use Modules\Blog\Repositories\CategoryRepository;
use Modules\Blog\Repositories\Eloquent\EloquentCategoryRepository;
use Modules\Blog\Repositories\Eloquent\EloquentPostRepository;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Events\BuildingSidebar;
use Modules\Core\Events\LoadingBackendTranslations;
use Modules\Core\Traits\CanPublishConfiguration;

class BlogServiceProvider extends ServiceProvider
{
    use CanPublishConfiguration;
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->registerBindings();
        $this->app['events']->listen(BuildingSidebar::class, RegisterBlogSidebar::class);

        $this->app['events']->listen(LoadingBackendTranslations::class, function (LoadingBackendTranslations $event) {
            // append translations
        });
    }

    public function boot()
    {
        $this->publishConfig('blog', 'permissions');
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');
        $this->publishConfig('blog', 'config');
        $this->publishConfig('blog', 'permissions');
        $this->publishConfig('blog', 'settings');
        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');
        //$this->registerViewComposers();
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }

    private function registerBindings()
    {
        $this->app->bind(PostRepository::class, function () {
            $repository = new EloquentPostRepository(new Post());

            if (config('app.cache') === false) {
                return $repository;
            }

            return new CachePostDecorator($repository);
        });

        $this->app->bind(CategoryRepository::class, function () {
            $repository = new EloquentCategoryRepository(new Category());

            if (config('app.cache') === false) {
                return $repository;
            }

            return new CacheCategoryDecorator($repository);
        });
    }

    private function registerViewComposers()
    {
        $this->app['view']->composer(
            config('asgard.blog.config.latest-posts', ['blog.*']),
            \Modules\Blog\Composers\Frontend\LatestPostsComposer::class
        );

        $this->app['view']->composer([
            'blog::admin.posts.create',
            'blog::admin.posts.edit',
        ], \Modules\Core\Composers\CurrentUserViewComposer::class);
    }
}
