<?php

namespace Modules\Notes\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class ResponseToResponse extends Model
{
    use Translatable;

    protected $table = 'notes__responsetoresponses';
    public $translatedAttributes = [];
    protected $fillable = [];
}
