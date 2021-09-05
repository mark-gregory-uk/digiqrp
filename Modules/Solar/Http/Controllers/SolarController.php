<?php


namespace Modules\Solar\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Modules\Solar\Entities\Solar;

class SolarController  extends Controller
{


    /**
     * Recover Solar Sunspots counts
     * @param Request $request
     * @return JsonResponse
     */
    public function sunspots(Request $request): JsonResponse
    {
        if ($request->ajax()) {
            $sunSpots = Solar::all();
            $data = [];
            $titles = [];
            foreach ($sunSpots as $entry){
                array_push($data,(int)$entry->sunspots);
                array_push($titles,(int)$entry->solarflux);
            }
            return response()->json(['titles'=>$titles,'data' => $data]);
        }
        return response()->json(['data' => 'Not available']);
    }
}