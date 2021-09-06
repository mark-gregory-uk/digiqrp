<?php


namespace Modules\Solar\Http\Controllers;

use App\Http\Controllers\Controller;
use carbon\Carbon;
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
            $entries = Solar::whereBetween('created_at', [
                Carbon::now()->subdays(30)->format('Y-m-d'),
                Carbon::now()->subday()->format('Y-m-d')
            ])->get();


            $data = [];
            $magfield = [];
            $titles = [];
            foreach ($entries as $entry){
                array_push($data,(int)$entry->sunspots);
                array_push($magfield,(int)$entry->magneticfield);
                array_push($titles,(int)$entry->created_at->format('d'));
            }
            return response()->json(['titles'=>$titles,'data' => $data,'magfield'=> $magfield]);
        }
        return response()->json(['data' => 'Not available']);
    }

    /**
     * Recover Solar Sunspots counts
     * @param Request $request
     * @return JsonResponse
     */
    public function magneticField(Request $request): JsonResponse
    {
        if ($request->ajax()) {
            $entries = Solar::whereBetween('created_at', [
                Carbon::now()->subdays(30)->format('Y-m-d'),
                Carbon::now()->subday()->format('Y-m-d')
            ])->get();


            $data = [];
            $titles = [];
            $sunSpots = [];
            foreach ($entries as $entry){
                array_push($data,(int)$entry->magneticfield);
                array_push($sunSpots,(int)$entry->sunspots);
                array_push($titles,(int)$entry->created_at->format('d'));
            }
            return response()->json(['titles'=>$titles,'data' => $data,'spots'=>$sunSpots]);
        }
        return response()->json(['data' => 'Not available']);
    }

}