<?php

namespace Modules\Logbook\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Logbook extends Model
{
    use Translatable;

    protected $table = 'logbook__logbooks';
    public $translatedAttributes = [];
    protected $fillable = [];
}
