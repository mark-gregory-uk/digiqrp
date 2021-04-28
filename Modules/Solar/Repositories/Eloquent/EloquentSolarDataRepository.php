<?php

namespace Modules\Solar\Repositories\Eloquent;

use Carbon\Carbon;
use Modules\Solar\Repositories\SolarDataRepository;
use Modules\Core\Repositories\Eloquent\EloquentBaseRepository;

class EloquentSolarDataRepository extends EloquentBaseRepository implements SolarDataRepository
{

    public function latestReports(){

        $today = Carbon::now()->format('Y-m-d').'%';


        $latestReport = $this->with('reports')->where('created_at', 'like', $today)->orderBy('created_at','desc')->first();


        return $latestReport;
    }

}
