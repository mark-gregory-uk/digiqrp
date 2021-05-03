<?php

namespace Modules\Download\Entities;

use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    protected $table = 'download__downloads';
    public $translatedAttributes = [];
    protected $fillable = [];
}
