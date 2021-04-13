<?php

namespace Modules\Blog\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use Translatable;

    protected $table = 'blog__posts';
    public $translatedAttributes = [];
    protected $fillable = [];
}
