<?php

namespace Modules\Logbook\Console;

use Illuminate\Console\Command;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookCountry;
use Modules\Logbook\Entities\LogbookEntry;
use Modules\Logbook\Entities\MacLogger;
use Modules\Setting\Contracts\Setting;
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
     * @var Setting
     */
    private $settings;

    /**
     * ImportMacLogger constructor.
     * @param Setting $settings
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
    public function handle(Setting $settings)
    {
        $this->settings = $settings;

        // We need to recover the logbook and its owner

        $logbook = Logbook::with('entries')
            ->where('owner_id', '=', 1)
            ->where('slug', '=', 'main')->first();

        // Purge All the existing entries please.
        LogbookEntry::where('parent_id', $logbook->id)->delete();

        $default_lat = 52.3848;
        $default_lng = 1.8215;

        $user_lat = $this->settings->get('logbook::latitude');
        $user_lng = $this->settings->get('logbook::longitude');

        if ($user_lat & $user_lng) {
            $latitude = $user_lat;
            $longitude = $user_lng;
        } else {
            $latitude = $default_lat;
            $longitude = $default_lng;
        }

        $macLoggerRecords = Maclogger::all();
        $countries = LogbookCountry::all();

        $this->info('Identified : '.count($macLoggerRecords).' Records');
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

            $country = $countries->firstWhere('name', $row->dxcc_country);

            if (! empty($country)) {
                $logEntry->country_slug = $country->code;
            }

            $distanceKM = (float) $this->distance($latitude, $longitude, $row->latitude, $row->longitude);
            if ($distanceKM > 0) {
                $distanceMiles = $distanceKM / 1.609;
                $logEntry->distance_km = $distanceKM;
                $logEntry->distance_miles = $distanceMiles;
            }

            $logEntry->save();
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

    /**
     * Calculate the as the crow flies distance in miles and kilometers.
     * @param $lat1
     * @param $lon1
     * @param $lat2
     * @param $lon2
     * @return float|int
     */
    private function distance($lat1, $lon1, $lat2, $lon2)
    {
        $pi80 = M_PI / 180;
        $r = 6372.797; // mean radius of Earth in km
        $calculatedDistance = 0;
        if ((float) $lat2 != 0 && (float) $lon2 != 0) {
            $lat1 *= $pi80;
            $lon1 *= $pi80;
            $lat2 *= $pi80;
            $lon2 *= $pi80;
            $dlat = $lat2 - $lat1;
            $dlon = $lon2 - $lon1;
            $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $calculatedDistance = $r * $c;
        }

        return $calculatedDistance;
    }
}
