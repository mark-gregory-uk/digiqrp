<?php

namespace Modules\Logbook\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use DateTime;
use Illuminate\Http\Request;
use Log;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookEntry;
use Modules\Logbook\Libraries\ADIF_Parser;

class LogbookController extends Controller
{


    public function processADIF(Request $request)
    {
        if (in_array($request->method(), ['POST'])){

            $logbook = Logbook::with('entries')
                ->where('owner_id', '=', 1)
                ->where('slug', '=', 'main')->first();

            $preabmle = '<adif_ver:5>3.1.1 <created_timestamp:15>20210518 124425 <programid:6>WSJT-X <programversion:5>2.3.0 <eoh>';
            $inData = $preabmle . ' ' . $request->get('payload');
            $p = new ADIF_Parser;
            $p->feed($inData);
            $p->initialize();

            while ($record = $p->get_record()) {
                if (count($record) == 0) {
                    return response()->json(['data' => 'nok', 'state' => 'error']);
                };

                /*
                 *  'qso_start',
        'qso_end',
        'call',
        'grid',
        'mode',
        'tx_frequency',
        'rx_frequency',
        'rst_received',
        'rst_sent',
        'power',
        'comments',
        'band_rx',
        'band_tx',
        'payload',
        'parent_id',
        'distance_km',
        'distance_miles',
        'created_at',
        'updated_at',
        'country_slug',
        'dxcc_country',
                 */

                $data = array();
                $logEntry = $logbook->entries()->create();
                $logEntry->call = $record['call'];
                $logEntry->tx_frequency = $record['freq'];
                $logEntry->rx_frequency = $record['freq'];
                $logEntry->rst_received = $record['rst_rcvd'];
                $logEntry->rst_sent = $record['rst_sent'];
                $logEntry->band_rx = $record['band'];
                $logEntry->band_tx = $record['band'];
                $logEntry->comments = $record['comment'];
                $logEntry->grid = $record['gridsquare'];
                $logEntry->mode = $record['mode'];

                $startDate = date("Y-m-d", strtotime($record['qso_date']));
                $startTime = date('m:h:s',strtotime($record['time_on']));
                $qsoStart = strtotime($startDate .' '. $startTime);

                $endDate = date("Y-m-d", strtotime($record['qso_date_off']));
                $endTime = date('m:h:s',strtotime($record['time_off']));
                $qsoEnd = strtotime($endDate .' '. $endTime);


                $logEntry->qso_start = date('Y/m/d H:i:s', $qsoStart);
                $logEntry->qso_end = date('Y/m/d H:i:s', $qsoEnd);

                $response = \Modules\Logbook\Http\Controllers\LogbookController::hamQTH($logEntry->call);

                if ($response['dxcc']['adif'] != '0') {
                    $logEntry->addCallDetails($response);
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





}
