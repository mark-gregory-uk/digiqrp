<?php

namespace Modules\Notification\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use Translatable;

    protected $table = 'notification__notifications';
    public $translatedAttributes = [];
    protected $fillable = [];
}
