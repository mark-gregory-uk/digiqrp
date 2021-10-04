<?php

namespace Modules\Logbook\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use DateTime;
use DateTimeZone;
use Illuminate\Http\Request;
use Log;
use Modules\CallBook\Http\Controllers\CallBookController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookEntry;
use Modules\Logbook\Libraries\ADIF_Parser;
use Modules\Setting\Contracts\Setting;

class LogbookController extends Controller
{

    /**
     * @var Setting
     */
    private $settings;

    public function processADIF(Request $request,Setting $settings)
    {

        $this->settings = $settings;

        if (in_array($request->method(), ['POST'])){
            $payload = $request->get('payload');
            $logbook = Logbook::with('entries')
                ->where('owner_id', '=', 1)
                ->where('slug', '=', 'main')->first();

            $preabmle = '<adif_ver:5>3.1.1 <created_timestamp:15>20210518 124425 <programid:6>WSJT-X <programversion:5>2.3.0 <eoh>';
            $inData = $preabmle . ' ' . $payload;
            $p = new ADIF_Parser;
            $p->feed($inData);
            $p->initialize();

            while ($record = $p->get_record()) {
                if (count($record) == 0) {
                    return response()->json(['data' => 'nok', 'state' => 'error']);
                };

                $data = array();
                $logEntry = $logbook->entries()->create();
                $logEntry->call = $record['call'];
                $logEntry->tx_frequency = $record['freq'];
                $logEntry->rx_frequency = $record['freq'];
                $logEntry->rst_received = ( $record['rst_rcvd'] ? $record['rst_rcvd']:'');
                $logEntry->rst_sent = $record['rst_sent'];
                $logEntry->band_rx = $record['band'];
                $logEntry->band_tx = $record['band'];
                if (in_array('comment',$record)){
                    $logEntry->comments = $record['comment'];
                }
                $logEntry->grid = $record['gridsquare'];
                $logEntry->mode = $record['mode'];
                $logEntry->payload = $payload;
                $startDate = $this->formatDate($record['qso_date']);
                $startTime = $this->formatTime($record['time_on']);
                $endDate = $this->formatDate($record['qso_date_off']);
                $endTime = $this->formatTime($record['time_off']);


                $logEntry->qso_start = $startDate .' '. $startTime;
                $logEntry->qso_end = $endDate .' '. $endTime;

                $response = CallBookController::hamQTHLookup($logEntry->call);

                if ($response['dxcc']['adif'] != '0') {
                    $logEntry->addCallDetails($this->settings,$response);
                } else {
                    $logEntry->save();
                }
                return response()->json(['data' => 'ok', 'state' => 'processed']);
            }

        }
        return response()->json(['data' => 'nok', 'state' => 'error']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return |null
     */
    public function store(Request $request)
    {
        if (in_array($request->method(), ['POST'])
            && $request->isJson()
        ) {
            $logbook = Logbook::with('entries')
                ->where('owner_id', '=', 1)
                ->where('slug', '=', 'main')->first();

            $data = $request->json()->all();
            $logEntry = $logbook->entries()->create($data);

            $response = \Modules\Logbook\Http\Controllers\LogbookController::hamQTH($logEntry->call);

            if ($response['dxcc']['adif'] != '0') {
                $logEntry->addCallDetails($response);
            } else {
                $logEntry->save();
            }

            Log::info('New Log Entry Created for '.$logEntry->call);
        }

        return null;
    }

    /**
     * Get all logentries for a given user / logbook
     * this is useful for debugging.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLogEntries()
    {
        $logEntries = [];
        $logbook = Logbook::where('owner_id', '=', 1)->first();
        $data = LogbookEntry::where('parent_id', '=', $logbook->id)->orderBy('qso_end', 'desc')->get();

        foreach ($data as $d) {
            array_push($logEntries, $d);
        }

        return response()->json([$logEntries]);
    }

    /**
     * Sync the logbook entries with OSX application
     * need to add authentication to this call.
     * @param Request $request
     */
    public function syncLogEntries(Request $request)
    {
        if (in_array($request->method(), ['POST'])
            && $request->isJson()
        ) {
            $logbook = Logbook::where('owner_id', '=', 1)->first();
            $logbookEntries = LogbookEntry::where('parent_id', '=', $logbook->id)->orderBy('qso_end', 'desc')->get();

            // need to design this piece were we are syncing whole database.

            foreach ($logbookEntries as $entry) {
            }
        }
    }

    /**
     * Create a mac logger entry and lookup the
     * callsign.
     *
     * @param Request $request
     */
    public function storeMacLogger(Request $request)
    {
        log::info('Called Store MacLogger');

        if (in_array($request->method(), ['POST'])
            && $request->isJson()
        ) {
            $data = $request->json()->all();
            $entry = json_decode($data, true);
            $logbook = Logbook::with('entries')
                ->where('owner_id', '=', 1)
                ->where('slug', '=', 'main')->first();

            $logEntry = $logbook->entries()->create($entry);

            $response = \Modules\Logbook\Http\Controllers\LogbookController::hamQTH($logEntry->call);

            if ($response['dxcc']['adif'] != '0') {
                $logEntry->addCallDetails($response);
            } else {
                $logEntry->save();
            }

            Log::info('New Log Entry Created for '.$data['CALL']);
        }
    }

    private function formatDate($date){
        $year = substr($date,0,4);
        $month = substr($date,4,2);
        $day = substr($date,6,6);
        return $year.'-'.$month.'-'.$day;
    }

    private function formatTime($time){
        $hour = substr($time,0,2);
        $minutes = substr($time,2,2);
        $seconds = substr($time,4,4);
        return $hour.':'.$minutes.':'.$seconds;
    }



    public function search(Request $request){

        $call = $request->get('call');


        $logbook = Logbook::where('owner_id', '=', 1)->first();

        if ($call){

            $callData = LogbookEntry::where('parent_id', '=', $logbook->id)->where('call','=',$call)->orderBy('qso_end', 'desc')->get();
            if (count($callData)>0){
                return response()->json(['callsign'=>$callData[0]->call,'date'=>$callData[0]->qso_end,'band'=>$callData[0]->band_rx,'km'=>$callData[0]->distance_km,'count'=>count($callData) ],200);
            } else{
                return response()->json([
                    'success' => 'false',
                    'errors'  => $call.' not Found in database',
                ], 400);
            }

        }
    }



}
