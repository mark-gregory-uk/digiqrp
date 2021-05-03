<?php

namespace Modules\Download\Providers;

use Illuminate\Database\Eloquent\Factory as EloquentFactory;
use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Modules\Core\Events\BuildingSidebar;
use Modules\Core\Events\LoadingBackendTranslations;
use Modules\Core\Traits\CanPublishConfiguration;
use Modules\Download\Listeners\RegisterDownloadSidebar;

class DownloadServiceProvider extends ServiceProvider
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
        $this->app['events']->listen(BuildingSidebar::class, RegisterDownloadSidebar::class);

        $this->app['events']->listen(LoadingBackendTranslations::class, function (LoadingBackendTranslations $event) {
            $event->load('downloads', Arr::dot(trans('download::downloads')));
        });
    }

    public function boot()
    {
        $this->publishConfig('download', 'permissions');
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
            'Modules\Download\Repositories\DownloadRepository',
            function () {
                $repository = new \Modules\Download\Repositories\Eloquent\EloquentDownloadRepository(new \Modules\Download\Entities\Download());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Download\Repositories\Cache\CacheDownloadDecorator($repository);
            }
        );
    }
}
