<?php

namespace Modules\Logbook\Console;

use Illuminate\Console\Command;
use Modules\CallBook\Http\Controllers\CallBookController;
use Modules\Logbook\Http\Controllers\LogbookController;
use Modules\Setting\Support\Settings;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class CallChecker extends Command
{

    private $settings;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hamqth:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check a callsign with hamQTH Server';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct( Settings $settings)
    {
        $this->settings = $settings;
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        $user_lat = $this->settings->get('logbook::latitude');
        $user_lng = $this->settings->get('logbook::longitude');

        $callSign = $this->ask('Enter station callsign');
        $response = CallBookController::hamQTHLookup($callSign);
        $this->info(var_dump($response));
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['example', InputArgument::REQUIRED, 'An example argument.'],
        ];
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
        ];
    }
}
