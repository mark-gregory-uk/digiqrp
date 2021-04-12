<?php

namespace Modules\Logbook\Providers;

use Illuminate\Database\Eloquent\Factory as EloquentFactory;
use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Modules\Core\Traits\CanPublishConfiguration;
use Modules\Core\Events\BuildingSidebar;
use Modules\Core\Events\LoadingBackendTranslations;
use Modules\Logbook\Console\ImportMacLogger;
use Modules\Logbook\Listeners\RegisterLogbookSidebar;

class LogbookServiceProvider extends ServiceProvider
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
        $this->registerCommands();

        $this->app['events']->listen(BuildingSidebar::class, RegisterLogbookSidebar::class);
        $this->app['events']->listen(LoadingBackendTranslations::class, function (LoadingBackendTranslations $event) {
            $event->load('menu', Arr::dot(trans('logbook::logbooks')));
        });


    }

    public function boot()
    {
        $this->publishConfig('logbook', 'permissions');
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
            'Modules\Logbook\Repositories\LogbookRepository',
            function () {
                $repository = new \Modules\Logbook\Repositories\Eloquent\EloquentLogbookRepository(new \Modules\Logbook\Entities\Logbook());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Logbook\Repositories\Cache\CacheLogbookDecorator($repository);
            }
        );

    }

    /**
     * Register all commands for this module
     */
    private function registerCommands()
    {
        $this->registerRefreshCommand();
    }


    /**
     * Register the MacLogger SQLite DB import Command
     */
    private function registerRefreshCommand()
    {
        $this->app->singleton('command.logbook.import', function ($app) {
            return new ImportMacLogger($app['Modules\Logbook\Repositories\LogbookRepository']);
        });

        $this->commands('command.logbook.import');
    }


}
