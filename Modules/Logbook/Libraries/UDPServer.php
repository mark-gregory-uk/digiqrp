<?php


namespace Modules\Logbook\Libraries;


use Illuminate\Support\Facades\Log;
use Modules\CallBook\Http\Controllers\CallBookController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookEntry;
use Modules\Setting\Support\Settings;
use Modules\Notification\Services\Notification;

class UDPServer extends Common
{
    /**
     * @var Settings
     */
    private $settings;

    private $notification;

    public function __construct()
    {
        parent::__construct();

    }

    /**
     * Start the UDP Listener
     * @param Settings $settings
     * @param bool $debug
     * @return \Illuminate\Http\JsonResponse
     */
    public function listener( Notification $notification,Settings $settings,bool $debug = false)
    {
        $this->settings = $settings;
        $this->notification = $notification;
        while (1) {
            $r = socket_recvfrom($this->socket, $buf, 512, 0, $remote_ip, $remote_port);

            if ($debug) {
                Log::info("End:" . strpos($buf, ']') . " $remote_ip : $remote_port -- " . $buf);
            }

            $logbook = Logbook::with('entries')
                ->where('owner_id', '=', 1)
                ->where('slug', '=', 'main')->first();

            $preabmle = '<adif_ver:5>3.1.1 <created_timestamp:15>20210518 124425 <programid:6>WSJT-X <programversion:5>2.3.0 <eoh>';
            $inData = $preabmle . ' ' . $buf;
            $p = new ADIF_Parser;
            $p->feed($inData);
            $p->initialize();

            while ($record = $p->get_record()) {
                if (count($record) == 0) {
                    return response()->json(['data' => 'nok', 'state' => 'error']);
                };

                $data = [];
                $logEntry = $logbook->entries()->create();
                $logEntry->call = $record['call'];
                $logEntry->tx_frequency = $record['freq'];
                $logEntry->rx_frequency = $record['freq'];
                $logEntry->rst_received = $record['rst_rcvd'];
                $logEntry->rst_sent = $record['rst_sent'];
                $logEntry->band_rx = $record['band'];
                $logEntry->band_tx = $record['band'];
                //$logEntry->comments = $record['comment'];
                $logEntry->grid = $record['gridsquare'];
                $logEntry->mode = $record['mode'];
                $logEntry->payload = $buf;
                $startDate = $this->formatDate($record['qso_date']);
                $startTime = $this->formatTime($record['time_on']);
                $endDate = $this->formatDate($record['qso_date_off']);
                $endTime = $this->formatTime($record['time_off']);

                $logEntry->qso_start = $startDate . ' ' . $startTime;
                $logEntry->qso_end = $endDate . ' ' . $endTime;

                 $existingEntry = LogbookEntry::where('call','=',$record['call'])->first();

                 // Check for an existing entry
                 if ($existingEntry){
                     $logEntry->addExistingCallDetails($existingEntry);
                 } else
                 {
                     $response = CallBookController::hamQTHLookup($logEntry->call);

                     if ($response){
                         if ($response['dxcc']['adif'] != '0') {
                             $logEntry->addCallDetails($this->settings,$response);
                         } else {
                             $logEntry->save();
                         }
                     } else {
                         $logEntry->save();
                     }
                 }
               // $this->notification->pushToAdmins('New Station Logged', $logEntry->call.' Logged' , 'fa fa-hand-peace-o text-green');

                Log::info("New Log Entry Processed");
            }
        }
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
