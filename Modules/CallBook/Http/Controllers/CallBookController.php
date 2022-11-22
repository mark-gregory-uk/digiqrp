<?php

namespace Modules\CallBook\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Modules\Setting\Contracts\Setting;

class CallBookController extends Controller
{

    /**
     * @var Setting
     */
    private $settings;
    private $hamQthUserName;
    private $hamQthPassword;
    private $hamQthBaseUrl;
    private $hamQthBioURL;
    private $hamQthRecentActivityURL;

    public function __construct(Setting $settings)
    {
        $this->settings = $settings;
        $this->hamQthUserName =  $this->settings->get('callbook::username');
        $this->hamQthPassword = $this->settings->get('callbook::password');;
        $this->hamQthBaseUrl = $this->settings->get('callbook::base_xml_url');
        $this->hamQthBioURL = $this->settings->get('callbook::bio_url');
        $this->hamQthRecentActivityURL = $this->settings->get('callbook::recent_activity_url');
    }

    /**
     * Display a listing of the resource.
     * @return Renderable
     */
    public function index()
    {
        return view('callbook::index');
    }

    /**
     * Show the form for creating a new resource.
     * @return Renderable
     */
    public function create()
    {
        return view('callbook::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Renderable
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function show($id)
    {
        return view('callbook::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function edit($id)
    {
        return view('callbook::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Renderable
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Renderable
     */
    public function destroy($id)
    {
        //
    }

    public function getHamQTHActivity($call){

        $sessionId = null;
        $cURLConnection = curl_init();
        if (! Cache::has('hamqth')){
            $sessionId = $this->getHamQthKey();
            Cache::put('hamqth', $sessionId,3600);
        } else {
            $sessionId = Cache::get('hamqth');
        }

        $targetUrl = "$this->hamQthRecentActivityURL?id=$sessionId&callsign=$call&rec_activity=1&log_activity=1&logbook=1";

        curl_setopt($cURLConnection, CURLOPT_URL, $targetUrl);
        curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($cURLConnection);
        if(curl_errno($cURLConnection)){
            return null;
        }
        curl_close($cURLConnection);

        $xml = simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA);

        return json_encode($xml);

    }

    public function getHamQTHBio($call){

        $sessionId = null;
        $cURLConnection = curl_init();
        if (! Cache::has('hamqth')){
            $sessionId = $this->getHamQthKey();
            Cache::put('hamqth', $sessionId,3600);
        } else {
            $sessionId = Cache::get('hamqth');
        }

        $targetUrl = "$this->hamQthBioURL?id=$sessionId&callsign=$call&strip_html=1";

        curl_setopt($cURLConnection, CURLOPT_URL, $targetUrl);
        curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($cURLConnection);
        if(curl_errno($cURLConnection)){
            return null;
        }
        curl_close($cURLConnection);

        $xml = simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA);

        return json_encode($xml);
    }

    public function getHamQthDetails($call){

        $sessionId = null;
        $cURLConnection = curl_init();
        if (! Cache::has('hamqth')){
            $sessionId = $this->getHamQthKey();
            Cache::put('hamqth', $sessionId,3600);
        } else {
            $sessionId = Cache::get('hamqth');
        }

        $targetUrl = "$this->hamQthBaseUrl?id=$sessionId&callsign=$call";

        curl_setopt($cURLConnection, CURLOPT_URL, $targetUrl);
        curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($cURLConnection);
        if(curl_errno($cURLConnection)){
            return null;
        }
        curl_close($cURLConnection);

        $xml = simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA);

        return json_encode($xml);

    }

    private function getHamQthKey(){
        $cURLConnection = curl_init();

        curl_setopt($cURLConnection, CURLOPT_URL, "$this->hamQthBaseUrl?u=$this->hamQthUserName&p=$this->hamQthPassword");
        curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($cURLConnection);
        if(curl_errno($cURLConnection)){
            return null;
        }
        curl_close($cURLConnection);

        $xml = simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA);
        return (string) $xml->session[0]->session_id;
    }

    /**
     * Call to HamQTH for call-sign Data. with DXCC like call
     *
     * @param $callsign
     *
     * @return mixed
     */
    public static function hamQTHLookup($callsign)
    {
        $cURLConnection = curl_init();

        curl_setopt($cURLConnection, CURLOPT_URL, 'https://www.hamqth.com/dxcc.php?callsign='.$callsign);
        curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($cURLConnection);
        if(curl_errno($cURLConnection)){
            return null;
        }
        curl_close($cURLConnection);

        $xml = simplexml_load_string($response, 'SimpleXMLElement', LIBXML_NOCDATA);
        $json = json_encode($xml);

        return json_decode($json, true);
    }

    public function lookup(Request $request){

        $call = $request->get('callSign');

        //$details = json_decode($this->getHamQthDetails($call,$this->settings));

        if ($call){
            $dataPath = module_path('CallBook').'/Libraries/cty.dat';
            if (file_exists(module_path('CallBook').'/Libraries/dxcc.pl')){
                exec('/usr/bin/perl '.module_path('CallBook').'/Libraries/dxcc.pl '.$call .' '.$dataPath,$output);
                return response()->json(['call'=>$output[0],'country'=>$output[3],'continent' => $output[6],'timezone' => ($output[9] ? $output[9] : '0') ]);
            }
        }
    }

    static public function dxccLookup($call){
        if ($call){
            $dataPath = module_path('CallBook').'/Libraries/cty.dat';
            if (file_exists(module_path('CallBook').'/Libraries/dxcc.pl')){
                exec('/usr/bin/perl '.module_path('CallBook').'/Libraries/dxcc.pl '.$call .' '.$dataPath,$output);
                $response = [];
                $response += ['country'=>$output[3]];
                $response += ['continent'=>$output[6]];
                $response += ['lat'=>$output[7]];
                $response += ['lng'=>$output[8]];
                return $response;
            }
        }
    }


}
