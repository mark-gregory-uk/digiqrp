<?php

namespace Modules\Logbook\Providers;

use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Modules\Core\Events\BuildingSidebar;
use Modules\Core\Events\LoadingBackendTranslations;
use Modules\Core\Traits\CanPublishConfiguration;
use Modules\Logbook\Console\CallChecker;
use Modules\Logbook\Console\ImportMacLogger;
use Modules\Logbook\Console\UDPSender;
use Modules\Logbook\Console\UDPServer;
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
            $event->load('menu', Arr::dot(trans('logbook::countries')));
        });
    }

    public function boot()
    {
        $this->publishConfig('logbook', 'permissions');
        $this->publishConfig('logbook', 'settings');
        $this->publishConfig('logbook', 'config');
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
            'Modules\Logbook\Repositories\LogbookRepository',
            function () {
                $repository = new \Modules\Logbook\Repositories\Eloquent\EloquentLogbookRepository(new \Modules\Logbook\Entities\Logbook());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Logbook\Repositories\Cache\CacheLogbookDecorator($repository);
            }
        );

        $this->app->bind(
            'Modules\Logbook\Repositories\LogbookCountryRepository',
            function () {
                $repository = new \Modules\Logbook\Repositories\Eloquent\EloquentLogbookCountryRepository(new \Modules\Logbook\Entities\LogbookCountry());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Logbook\Repositories\Cache\CacheLogbookCountryDecorator($repository);
            }
        );

        $this->app->bind(
            'Modules\Logbook\Repositories\LogbookEntryRepository',
            function () {
                $repository = new \Modules\Logbook\Repositories\Eloquent\EloquentLogbookEntryRepository(new \Modules\Logbook\Entities\LogbookEntry());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Logbook\Repositories\Cache\CacheLogbookEntryDecorator($repository);
            }
        );
    }

    /**
     * Register all commands for this module.
     */
    private function registerCommands()
    {
        $this->registerRefreshCommand();
        $this->commands([
            UDPServer::class,
            CallChecker::class,
            UDPSender::class
        ]);
    }

    /**
     * Register the MacLogger SQLite DB import Command.
     */
    private function registerRefreshCommand()
    {
        $this->app->singleton('command.logbook.import', function ($app) {
            return new ImportMacLogger($app['Modules\Logbook\Repositories\LogbookRepository']);
        });

        $this->commands('command.logbook.import');
    }
}
