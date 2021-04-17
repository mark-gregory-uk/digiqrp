<?php

namespace Modules\Logbook\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Log;
use Modules\Logbook\Entities\Logbook;

class LogbookController extends Controller
{
    /**
     * Store a newly created resource in storage.
     * @param Request $request
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
     * Create a mac logger entry and lookup the
     * callsign
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
