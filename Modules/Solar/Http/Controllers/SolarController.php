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
            $sunSpots = Solar::whereBetween('created_at', [
                \carbon\Carbon::now()->subdays(30)->format('Y-m-d'),
                \carbon\Carbon::now()->subday()->format('Y-m-d')
            ])->get();


            $data = [];
            $titles = [];
            foreach ($sunSpots as $entry){
                array_push($data,(int)$entry->sunspots);
                array_push($titles,(int)$entry->created_at->format('d'));
            }
            return response()->json(['titles'=>$titles,'data' => $data]);
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
            $sunSpots = Solar::whereBetween('created_at', [
                \carbon\Carbon::now()->subdays(30)->format('Y-m-d'),
                \carbon\Carbon::now()->subday()->format('Y-m-d')
            ])->get();


            $data = [];
            $titles = [];
            foreach ($sunSpots as $entry){
                array_push($data,(int)$entry->magneticfield);
                array_push($titles,(int)$entry->created_at->format('d'));
            }
            return response()->json(['titles'=>$titles,'data' => $data]);
        }
        return response()->json(['data' => 'Not available']);
    }

}