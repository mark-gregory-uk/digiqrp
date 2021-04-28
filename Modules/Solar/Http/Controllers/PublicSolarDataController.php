<?php

namespace Modules\Solar\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Modules\Solar\Entities\SolarBandData;
use Modules\Solar\Entities\SolarData;
use Modules\Solar\Repositories\SolarDataRepository;
use Modules\Solar\Repositories\SolarDataRowRepository;
use SimpleXMLElement;

class PublicSolarDataController extends Controller
{
    /**
     * @var SolarDataRepository
     */
    private $solardata;


    /**
     * @var SolarDataRowRepository
     */
    private $solarDataRowRepository;



    public function __construct(SolarDataRowRepository $solarDataRowRepository)
    {
        //parent::__construct();
        $this->solarDataRowRepository = $solarDataRowRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $xmlstr = file_get_contents('http://www.hamqsl.com/solarxml.php');
        $xmlobj = new SimpleXMLElement($xmlstr);


        $data = [];
        $data['source']=$xmlobj->source;
        $data['last_updated']=$xmlobj->updated;
        $data['noise_level']=$xmlobj->signalnoise;

        $solarData = new SolarData();
        $solarData->source = (string)$xmlobj->solardata->source;
        $solarData->noise_level = (string)$xmlobj->solardata->signalnoise;
        $solarData->last_updated = (string)$xmlobj->solardata->updated;
        $solarData->save();

        foreach ($xmlobj->solardata->calculatedconditions as $bands){

            foreach ($bands as $band){

                $target = (string)$band->attributes()->name;
                $existingRow = $this->solarDataRowRepository->where('name','=',$target)->where('solar_id','=',$solarData->id)->first();

                if (! empty($existingRow)){
                    if ((string)$band->attributes()->time == 'day'){
                        $existingRow->day = (string)$band->attributes()->time;
                        $existingRow->day_condx = (string)$band[0];
                    }
                    if ((string)$band->attributes()->time == 'night'){
                        $existingRow->night = (string)$band->attributes()->time;
                        $existingRow->night_condx = (string)$band[0];
                    }

                    $existingRow->save();
                } else {
                    $dataRow = new SolarBandData();
                    $dataRow->name = (string)$band->attributes()->name;

                    if ((string)$band->attributes()->time == 'day'){
                        $dataRow->day = (string)$band->attributes()->time;
                        $dataRow->day_condx = (string)$band[0];
                    }
                    if ((string)$band->attributes()->time == 'night'){
                        $dataRow->night = (string)$band->attributes()->time;
                        $dataRow->night_condx = (string)$band[0];
                    }
                    $dataRow->solar_id = $solarData->id;
                    $dataRow->save();
                }
             }
        }


        return view('solar::admin.solardatas.index', compact('solarData'));
    }

}
