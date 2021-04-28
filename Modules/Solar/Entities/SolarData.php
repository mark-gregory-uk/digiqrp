<?php

namespace Modules\Solar\Entities;

use Illuminate\Database\Eloquent\Model;

class SolarData extends Model
{

    protected $table = 'solar__reports';
    public $translatedAttributes = [];
    protected $fillable = [
        'name',
        'source',
        'noise_level',
        'last_updated',
    ];


    public function reports()
    {
        $data = $this->hasMany(SolarBandData::class, 'solar_id', 'id');
        return $data;
    }

}
