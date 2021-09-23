<?php

namespace Modules\Notes\Entities;

use Illuminate\Database\Eloquent\Model;

class ResponseToResponseTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = [];
    protected $table = 'notes__responsetoresponse_translations';
}
