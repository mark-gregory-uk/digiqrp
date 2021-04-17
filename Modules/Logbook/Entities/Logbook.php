<?php

namespace Modules\Logbook\Entities;

use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Entities\Sentinel\User;

class Logbook extends Model
{
    use Translatable;

    protected $table = 'logbook__logbooks';

    public $translatedAttributes = ['title'];

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'title',
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

    /**
     * Recover the log book entries.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function entries()
    {
        return $this->hasMany(LogbookEntry::class, 'parent_id', 'id');
    }
}
