<?php

namespace Modules\Solar\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Solar extends Model
{
    use Translatable;

    protected $table = 'solar__reports';
    public $translatedAttributes = [];

    protected $fillable = [
        'name',
        'source',
        'noise_level',
        'last_updated',
        'solarwind',
        'aurora',
        'solarflux',
        'aindex',
        'kindex',
        'xray',
        'heliumline',
        'sunspots',
        'protonflux',
        'electronflux',
        'magneticfield',
        'kindexnt',
        'normalization',
        'latdegree',
        'geomagfield',
        'fof2',
        'muffactor',
        'muf',
    ];

    public function reports()
    {
        return $this->hasMany(SolarBandData::class, 'solar_id', 'id');
    }
}
