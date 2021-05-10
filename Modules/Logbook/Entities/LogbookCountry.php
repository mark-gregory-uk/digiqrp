<?php

namespace Modules\Logbook\Entities;

use Illuminate\Database\Eloquent\Model;

class LogbookCountry extends Model
{
    protected $table = 'logbook__countries';

    protected $fillable = [
        'name',
        'code',
        'slug',
        'created_at',
        'updated_at',
    ];
}
