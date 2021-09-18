<?php

namespace Modules\Logbook\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\MacLogger;

class ProcessMacLogger implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $fileName;
    private $owner;
    private $countries;
    private $latitude;
    private $longitude;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($owner,$countries,$latitude,$longitude)
    {
        $this->countries = $countries;
        $this->owner = $owner;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $logbook = Logbook::with('entries')
            ->where('owner_id', '=', $this->owner)
            ->where('slug', '=', 'main')->first();

        $logEntries = $logbook->entries()->get();

        foreach ($logEntries as $logEntry) {
            $logEntry->delete();
        }

        $macLoggerRecords = Maclogger::all();

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
            $logEntry->mode = $row->mode;
            $logEntry->tx_frequency = $row->tx_frequency;
            $logEntry->rx_frequency = $row->rx_frequency;
            $logEntry->dxcc_id = $row->dxcc_id;
            $country = $this->countries->firstWhere('name', $row->dxcc_country);

            if (!empty($country)) {
                $logEntry->country_slug = $country->code;
            }

            $distanceKM = (float)$this->distance($this->latitude, $this->longitude, $row->latitude, $row->longitude);
            if ($distanceKM > 0) {
                $distanceMiles = $distanceKM / 1.609;
                $logEntry->distance_km = $distanceKM;
                $logEntry->distance_miles = $distanceMiles;
            }
            $logEntry->save();
            info('New ADIF Row Imported');
        }
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
