<?php

namespace Modules\Notes\Entities;

use Illuminate\Database\Eloquent\Model;

class ResponseTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = [];
    protected $table = 'notes__response_translations';
}
