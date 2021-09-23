<?php

namespace Modules\Notes\Providers;

use Illuminate\Database\Eloquent\Factory as EloquentFactory;
use Illuminate\Support\ServiceProvider;
use Modules\Core\Traits\CanPublishConfiguration;
use Modules\Core\Events\BuildingSidebar;
use Modules\Core\Events\LoadingBackendTranslations;
use Modules\Notes\Listeners\RegisterNotesSidebar;

class NotesServiceProvider extends ServiceProvider
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
        $this->app['events']->listen(BuildingSidebar::class, RegisterNotesSidebar::class);

        $this->app['events']->listen(LoadingBackendTranslations::class, function (LoadingBackendTranslations $event) {
            $event->load('documents', array_dot(trans('notes::documents')));
            $event->load('responses', array_dot(trans('notes::responses')));
            $event->load('responsetoresponses', array_dot(trans('notes::responsetoresponses')));
            // append translations



        });


    }

    public function boot()
    {
        $this->publishConfig('notes', 'permissions');

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
            'Modules\Notes\Repositories\DocumentRepository',
            function () {
                $repository = new \Modules\Notes\Repositories\Eloquent\EloquentDocumentRepository(new \Modules\Notes\Entities\Document());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Notes\Repositories\Cache\CacheDocumentDecorator($repository);
            }
        );
        $this->app->bind(
            'Modules\Notes\Repositories\ResponseRepository',
            function () {
                $repository = new \Modules\Notes\Repositories\Eloquent\EloquentResponseRepository(new \Modules\Notes\Entities\Response());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Notes\Repositories\Cache\CacheResponseDecorator($repository);
            }
        );
        $this->app->bind(
            'Modules\Notes\Repositories\ResponseToResponseRepository',
            function () {
                $repository = new \Modules\Notes\Repositories\Eloquent\EloquentResponseToResponseRepository(new \Modules\Notes\Entities\ResponseToResponse());

                if (! config('app.cache')) {
                    return $repository;
                }

                return new \Modules\Notes\Repositories\Cache\CacheResponseToResponseDecorator($repository);
            }
        );
// add bindings



    }


}
