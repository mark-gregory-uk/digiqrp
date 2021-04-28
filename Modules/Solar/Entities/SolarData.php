<?php

namespace Modules\Solar\Entities;

use Illuminate\Database\Eloquent\Model;

class SolarData extends Model
{

    protected $table = 'solar__solardatas';
    public $translatedAttributes = [];
    protected $fillable = [
        'day',
        'night',
        'name',
        'source',
        'noise_level',
        'last_updated',
    ];
}
