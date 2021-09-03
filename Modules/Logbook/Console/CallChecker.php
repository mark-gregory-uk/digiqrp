<?php

namespace Modules\Logbook\Console;

use Illuminate\Console\Command;
use Modules\Logbook\Http\Controllers\LogbookController;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class CallChecker extends Command
{
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
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        $callSign = $this->ask('Enter station callsign');
        $response = LogbookController::hamQTH($callSign);
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
