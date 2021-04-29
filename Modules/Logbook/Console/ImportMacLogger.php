<?php

namespace Modules\Logbook\Console;

use Illuminate\Console\Command;
use Modules\Logbook\Entities\Logbook;

use Modules\Logbook\Entities\MacLogger;
use Symfony\Component\Console\Input\InputOption;

class ImportMacLogger extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'maclogger:import { owner } { name }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports Rows from SQLite DB Database';

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
        // We need to recover the logbook and its owner

        $logbook = Logbook::with('entries')
            ->where('owner_id', '=', 1)
            ->where('slug', '=', 'main')->first();

        $macLoggerRecords = Maclogger::all();

        $this->info('Identified : ' . count($macLoggerRecords) . ' Records');
        $bar = $this->output->createProgressBar(count($macLoggerRecords));

        $bar->start();

        foreach ($macLoggerRecords as $row) {
            $logEntry = $logbook->entries()->create();
            $logEntry->call = $row->call;
            $logEntry->first_name = $row->first_name;
            $logEntry->last_name = $row->last_name;
            $logEntry->dxcc_country = $row->dxcc_country;
            $logEntry->grid = $row->grid;
            $logEntry->band_rx = $row->band_rx;
            $logEntry->band_tx = $row->band_tx;
            $logEntry->rst_sent = $row->rst_sent;
            $logEntry->rst_received = $row->rst_received;
            $logEntry->comments = $row->comments;
            $logEntry->qso_start = $row->qso_start;
            $logEntry->qso_end = $row->qso_done;
            $logEntry->lat = $row->latitude;
            $logEntry->lng = $row->longitude;
            $logEntry->power = $row->power;
            $logEntry->tx_frequency = $row->tx_frequency;
            $logEntry->rx_frequency = $row->rx_frequency;
            $logEntry->dxcc_id = $row->dxcc_id;
            $logEntry->save();

            //$logbook->attach($logEntry);
            $bar->advance();
        }
        $bar->finish();
        $this->info(PHP_EOL);
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [];
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['owner', null, InputOption::VALUE_OPTIONAL, 'The owner of the logbook.', null],
        ];
    }
}
