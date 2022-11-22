<?php

namespace Modules\Logbook\Entities;

use Illuminate\Database\Eloquent\Model;

class LogbookTranslation extends Model
{
    public $timestamps = false;
    protected $table = 'logbook__logbook_translations';

    protected $fillable = [
        'title',
    ];
}
