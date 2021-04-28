<?php

namespace Modules\Solar\Entities;

use Illuminate\Database\Eloquent\Model;

class SolarBandData extends Model
{

    protected $table = 'solar__banddata';
    public $translatedAttributes = [];
    protected $fillable = [
        'time',
        'condx',
        'solar_id',
    ];




    /**
     * The logbook that own this item.
     *
     * @return mixed
     */
    public function solarData()
    {
        return $this->belongsTo(SolarData::class);
    }

}
