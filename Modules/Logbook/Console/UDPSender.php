<?php

namespace Modules\Logbook\Console;

use Illuminate\Console\Command;
use Modules\Setting\Support\Settings;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class UDPSender extends Command
{

    /**
     * Current Settings
     * @var Settings
     */
    private $settings;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'udpsend:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a UDP Packet ( Debugging )';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(Settings $settings)
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

        $server_ip   = '127.0.0.1';
        $server_port = 2333;
        $message     = '<call:5>F4IRP <gridsquare:0> <mode:3>FT8 <rst_sent:3>+09 <rst_rcvd:3>-12 <qso_date:8>20210518 <time_on:6>124315 <qso_date_off:8>20210518 <time_off:6>124415 <band:3>30m <freq:9>10.137500 <station_callsign:5>G4LCH <my_gridsquare:6>IO92CJ <tx_pwr:2>11 <comment:25>FT8  Sent: +09  Rcvd: -12 <operator:5>G4LCH <eor>';
        print "Sending UDP Message to IP $server_ip, port $server_port";
        if ($socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP)) {
            socket_sendto($socket, $message, strlen($message), 0, $server_ip, $server_port);
        }


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
