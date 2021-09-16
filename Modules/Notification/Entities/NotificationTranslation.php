<?php

namespace Modules\Notification\Entities;

use Illuminate\Database\Eloquent\Model;

class NotificationTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = [];
    protected $table = 'notification__notification_translations';
}
