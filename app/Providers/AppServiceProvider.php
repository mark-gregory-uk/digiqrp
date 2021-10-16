<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(UrlGenerator $url)
    {
        Schema::defaultStringLength(191);


        // to be used when no ssl cert available its an override
        if(env('REDIRECT_HTTP'))
        {
            $url->forceScheme('http');
        }

        Carbon::setLocale(config('app.locale'));
        Carbon::serializeUsing(function (Carbon $carbon) {
            return $carbon->format('d/m/y H:i:s');
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
