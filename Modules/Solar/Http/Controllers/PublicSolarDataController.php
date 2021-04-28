<?php

namespace Modules\Solar\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Modules\Solar\Entities\SolarData;
use Modules\Solar\Repositories\SolarDataRepository;
use SimpleXMLElement;


class PublicSolarDataController extends Controller
{
    /**
     * @var SolarDataRepository
     */
    private $solardata;


    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $xmlstr = file_get_contents('http://www.hamqsl.com/solarxml.php');
        $xmlobj = new SimpleXMLElement($xmlstr);


        $solarData = [];


        $solarData['source']=$xmlobj->source;
        $solarData['last_updated']=$xmlobj->updated;
        $solarData['noise_level']=$xmlobj->signalnoise;

        foreach ($xmlobj->solardata->calculatedconditions as $bands){
            $bandsData = [];
            foreach ($bands as $band){
                  array_push($bandsData,['name'=>(string)$band->attributes()->name,'time'=>(string)$band->attributes()->time,'condx'=>(string)$band[0]]);
            }


        }


        $newReport = new SolarData;
        $newReport->save($solarData);


        return view('solar::admin.solardatas.index', compact(''));
    }

}
