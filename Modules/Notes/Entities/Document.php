<?php

namespace Modules\Notes\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use Translatable;

    protected $table = 'notes__documents';
    public $translatedAttributes = [];
    protected $fillable = [];
}
