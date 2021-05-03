<?php

namespace Modules\Logbook\Entities;

use Illuminate\Database\Eloquent\Model;
use Modules\User\Entities\Sentinel\User;

class LogFile extends Model
{
    protected $table = 'logbook__logfiles';

    public $translatedAttributes = [];

    protected $casts = [];

    protected $fillable = [
        'owner_id',
        'name',
        'file_path',
    ];

    /**
     * Recover the owner of the logbook.
     *
     * @return string
     */
    public function Owner()
    {
        $owner = User::find($this->owner_id);

        return  ! empty($owner->callsign) ? $owner->callsign : $owner->first_name.' '.$owner->last_name;
    }
}
