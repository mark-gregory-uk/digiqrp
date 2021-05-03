
composer require sentry/sentry-laravel


For Laravel 7.x and later:

public function report(Throwable $exception)
{
if (app()->bound('sentry') && $this->shouldReport($exception)) {
app('sentry')->captureException($exception);
}

    parent::report($exception);
}


For Laravel 5.x and 6.x:

public function report(Exception $exception)
{
if (app()->bound('sentry') && $this->shouldReport($exception)) {
app('sentry')->captureException($exception);
}

    parent::report($exception);
}


Setup Sentry with this command:

php artisan sentry:publish --dsn=https://1ea35d7788f54b6b931e6ef5936b6df9@o242607.ingest.sentry.io/5745699
