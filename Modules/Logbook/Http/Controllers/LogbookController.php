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

    /**
     * Ajax Method for displaying the logbook entries.
     *
     * @param Request $request
     *
     * @throws \Exception
     *
     * @return mixed
     */
    public function regions(Request $request)
    {
        if ($request->ajax()) {
            $logbook = Logbook::where('owner_id', '=', 1)->first();
            $usa = count(LogbookEntry::where('dxcc_country', '=', 'United States')->get());
            $russia = count(LogbookEntry::where('dxcc_country', 'like', '%Russia%')->get());
            $england = count(LogbookEntry::where('dxcc_country', '=', 'England')
                ->orWhere('dxcc_country', '=', 'Scotland')
                ->orWhere('dxcc_country', '=', 'Wales')
                ->orWhere('dxcc_country', '=', 'Ireland')
                ->orWhere('dxcc_country', '=', 'Northern Island')
                ->orWhere('dxcc_country', '=', 'Jersey')
                ->orWhere('dxcc_country', '=', 'Gurnsey')
                ->get());
            $eu = count(LogbookEntry::where('country_slug', '=', 'ES')
                ->orWhere('country_slug', '=', 'IT')
                ->orWhere('country_slug', '=', 'DE')
                ->orWhere('country_slug', '=', 'HU')
                ->orWhere('country_slug', '=', 'PL')
                ->orWhere('country_slug', '=', 'FR')
                ->orWhere('country_slug', '=', 'DK')
                ->get());

            $asia = count(LogbookEntry::where('country_slug', '=', 'JP')
                ->orWhere('country_slug', '=', 'JA')
                ->orWhere('country_slug', '=', 'HA')
                ->get());
            $all = count(LogbookEntry::all());

            $other = $all - ($russia + $usa + $england + $eu + $asia);

            $data = [];
            array_push($data, $usa);
            array_push($data, $russia);
            array_push($data, $england);
            array_push($data, $eu);
            array_push($data, $other);
            array_push($data, $asia);

            return response()->json(['data' => $data]);
        }
    }

    /**
     * Recover Log Entry Stats
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats(Request $request)
    {
        if ($request->ajax()) {
            $logbook = Logbook::where('owner_id', '=', 1)->first();

            $counts = LogbookEntry::where('parent_id', '=', $logbook->id)
            ->where('country_slug','!=','')
            ->selectRaw('dxcc_country, count(*) as total')
            ->groupBy('dxcc_country')
            ->pluck('total','dxcc_country')->all();
            $data = [];
            foreach ($counts as $key => $source){
                $data += [$key => $source];
            }
            return response()->json(['data' => $data]);
        }
        return response()->json(['data' => 'Not available']);
     }
}
