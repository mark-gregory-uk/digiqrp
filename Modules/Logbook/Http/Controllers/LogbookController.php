<?php

namespace Modules\Logbook\Http\Controllers;

use FloatingPoint\Stylist\Theme\Theme;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\View;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookEntry;
use Yajra\DataTables\Facades\DataTables;

class LogbookController extends Controller
{
    /**
     * Display the default Logbook view.
     *
     * @param Request $request
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function index(Request $request)
    {
        return View::make('logbook');
    }

    /**
     * Ajax Method for displaying the logbook entries.
     *
     * @param Request $request
     *
     * @throws \Exception
     *
     * @return mixed
     */
    public function all(Request $request)
    {
        if ($request->ajax()) {
            $logbook = Logbook::where('owner_id', '=', 1)->first();
            $data = LogbookEntry::where('parent_id', '=', $logbook->id)->orderBy('qso_end', 'desc')->get();

            foreach ($data as $d) {
                $d->payload = url('themes/prostar/img/flags/png/'.strtolower($d->country_slug).'.png');
            }

            return Datatables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    $btn = '<a href="javascript:void(0)" class="edit btn btn-primary btn-sm">View</a>';

                    return $btn;
                })
                ->rawColumns(['action'])
                ->make(true);
        }
    }

    /**
     * Show the specified resource.
     *
     * @param int $id
     *
     * @return Renderable
     */
    public function show($id)
    {
        return view('logbook::show', compact('logEntries'));
    }

    /**
     * Call to HamQTH for call-sign Data.
     *
     * @param $callsign
     *
     * @return mixed
     */
    public static function hamQTH($callsign)
    {
        $cURLConnection = curl_init();

        curl_setopt($cURLConnection, CURLOPT_URL, 'https://www.hamqth.com/dxcc.php?callsign='.$callsign);
        curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($cURLConnection);
        curl_close($cURLConnection);

        $xml = simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA);
        $json = json_encode($xml);

        return json_decode($json, true);
    }
}
