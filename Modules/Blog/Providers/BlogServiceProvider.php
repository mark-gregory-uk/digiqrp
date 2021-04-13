<?php

namespace Modules\Blog\Providers;

use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Modules\Blog\Listeners\RegisterBlogSidebar;
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
            $event->load('posts', Arr::dot(trans('blog::posts')));
            // append translations
        });
    }

    public function boot()
    {
        $this->publishConfig('blog', 'permissions');

        $this->loadMigrationsFrom(__DIR__.'/../Database/Migrations');
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
        $this->app->bind(
            'Modules\Blog\Repositories\PostRepository',
            function () {
                $repository = new \Modules\Blog\Repositories\Eloquent\EloquentPostRepository(new \Modules\Blog\Entities\Post());

                if (!config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Blog\Repositories\Cache\CachePostDecorator($repository);
            }
        );
        // add bindings
    }
}
