<?php

namespace Modules\Logbook\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Modules\CallBook\Http\Controllers\CallBookController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookEntry;
use Modules\Logbook\Libraries\ADIF_Parser;

class ProcessADIF implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $logbook;
    private $fileName;


    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(LogBook $logbook,String $fileName)
    {
        $this->logbook = $logbook;
        $this->fileName = $fileName;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $filename=storage_path('adif/' . $this->fileName);
        $adifContent = File::get($filename);

        $p = new ADIF_Parser;
        $p->feed($adifContent);
        $p->initialize();

        while ($record = $p->get_record()) {
            $existingEntry = LogbookEntry::where('call','=',$record['call'])->first();
            if (! $existingEntry){
                $logEntry = $this->logbook->entries()->create();
                $logEntry->call = $record['call'];
                $logEntry->tx_frequency = $record['freq'];
                $logEntry->rx_frequency = $record['freq'];
                $logEntry->rst_received = $record['rst_rcvd'];
                $logEntry->rst_sent = $record['rst_sent'];
                $logEntry->band_rx = $record['band'];
                $logEntry->band_tx = $record['band'];
                $logEntry->grid = $record['gridsquare'];
                $logEntry->mode = $record['mode'];
                $startDate = $this->formatDate($record['qso_date']);
                $startTime = $this->formatTime($record['time_on']);
                $endDate = $this->formatDate($record['qso_date_off']);
                $endTime = $this->formatTime($record['time_off']);

                $logEntry->qso_start = $startDate . ' ' . $startTime;
                $logEntry->qso_end = $endDate . ' ' . $endTime;

                $response = CallBookController::dxccLookup($logEntry->call);

                if ($response){
                    $logEntry->addDXCCEntries($response);
                    $logEntry->save();
                    Log::info("Log Entry Created");
                }
            } else {
                Log::info("Existing Contact Skipped");
            }
        }
        Log::info("ADIF Upload Complete");
    }

    /**
     * Format a date string for MySQL
     * @param $date
     * @return string
     */
    private function formatDate($date){
        $year = substr($date,0,4);
        $month = substr($date,4,2);
        $day = substr($date,6,6);
        return $year.'-'.$month.'-'.$day;
    }

    /**
     * Format a time string for mysql
     * @param $time
     * @return string
     */
    private function formatTime($time){
        $hour = substr($time,0,2);
        $minutes = substr($time,2,2);
        $seconds = substr($time,4,4);
        return $hour.':'.$minutes.':'.$seconds;
    }




}
