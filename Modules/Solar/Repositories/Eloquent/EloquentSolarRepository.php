<?php

namespace Modules\Solar\Repositories\Eloquent;

use Illuminate\Support\Carbon;
use Modules\Solar\Repositories\SolarRepository;
use Modules\Core\Repositories\Eloquent\EloquentBaseRepository;

class EloquentSolarRepository extends EloquentBaseRepository implements SolarRepository
{
    public function latestReports(){

        $today = Carbon::now()->format('Y-m-d').'%';


        $latestReport = $this->with('reports')->where('created_at', 'like', $today)->orderBy('created_at','desc')->first();


        return $latestReport;
    }
}