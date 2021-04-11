<?php

namespace Modules\Logbook\Entities;

use Illuminate\Database\Eloquent\Model;

class LogbookTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = [];
    protected $table = 'logbook__logbook_translations';
}
