<?php

namespace Modules\Solar\Providers;

use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Modules\Core\Events\BuildingSidebar;
use Modules\Core\Events\LoadingBackendTranslations;
use Modules\Core\Traits\CanPublishConfiguration;
use Modules\Solar\Listeners\RegisterSolarSidebar;

class SolarServiceProvider extends ServiceProvider
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
        $this->app['events']->listen(BuildingSidebar::class, RegisterSolarSidebar::class);

        $this->app['events']->listen(LoadingBackendTranslations::class, function (LoadingBackendTranslations $event) {
            $event->load('solar', Arr::dot(trans('solar::solars')));
            // append translations
        });
    }

    public function boot()
    {
        $this->publishConfig('solar', 'permissions');
        $this->publishConfig('solar', 'settings');
        $this->publishConfig('solar', 'config');
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
            'Modules\Solar\Repositories\SolarRepository',
            function () {
                $repository = new \Modules\Solar\Repositories\Eloquent\EloquentSolarRepository(new \Modules\Solar\Entities\Solar());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Solar\Repositories\Cache\CacheSolarDecorator($repository);
            }
        );

        $this->app->bind(
            'Modules\Solar\Repositories\SolarDataRowRepository',
            function () {
                $repository = new \Modules\Solar\Repositories\Eloquent\EloquentSolarDataRowRepository(new \Modules\Solar\Entities\SolarBandData());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Solar\Repositories\Cache\CacheSolarDataRowDecorator($repository);
            }
        );
    }
}
