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
     * The Report that own this item.
     *
     * @return mixed
     */
    public function solarData()
    {
        return $this->belongsTo(Solar::class);
    }
}
