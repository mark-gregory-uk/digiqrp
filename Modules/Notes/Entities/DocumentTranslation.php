<?php

namespace Modules\Notes\Entities;

use Illuminate\Database\Eloquent\Model;

class DocumentTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = [];
    protected $table = 'notes__document_translations';
}
