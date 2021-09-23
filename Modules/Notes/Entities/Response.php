<?php

namespace Modules\Notes\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    use Translatable;

    protected $table = 'notes__responses';
    public $translatedAttributes = [];
    protected $fillable = [];
}
