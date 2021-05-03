<?php

namespace Modules\Solar\Entities;

use Illuminate\Database\Eloquent\Model;

class SolarTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = [];
    protected $table = 'solar__reports_translations';
}
