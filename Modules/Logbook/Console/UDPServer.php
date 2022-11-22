<?php

namespace Modules\Logbook\Console;

use Illuminate\Console\Command;
use Modules\Notification\Services\Notification;
use Modules\Setting\Support\Settings;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class UDPServer extends Command
{

    /**
     * Current Settings
     * @var Settings
     */
    private $settings;
    private $notification;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'udpserver:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the Logger UDP Server';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(Settings $settings, Notification $notification)
    {
        $this->settings = $settings;
        $this->notification = $notification;
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $server =  new \Modules\Logbook\Libraries\UDPServer();
        $server->listener($this->notification,$this->settings,false);
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
