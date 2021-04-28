<?php

namespace Modules\Solar\Providers;

use Illuminate\Database\Eloquent\Factory as EloquentFactory;
use Illuminate\Support\ServiceProvider;
use Modules\Core\Traits\CanPublishConfiguration;
use Modules\Core\Events\BuildingSidebar;
use Modules\Core\Events\LoadingBackendTranslations;
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
            $event->load('solardatas', array_dot(trans('solar::solardatas')));
            // append translations

        });


    }

    public function boot()
    {
        $this->publishConfig('solar', 'permissions');

        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return array();
    }

    private function registerBindings()
    {
        $this->app->bind(
            'Modules\Solar\Repositories\SolarDataRepository',
            function () {
                $repository = new \Modules\Solar\Repositories\Eloquent\EloquentSolarDataRepository(new \Modules\Solar\Entities\SolarData());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Solar\Repositories\Cache\CacheSolarDataDecorator($repository);
            }
        );

    }

}
