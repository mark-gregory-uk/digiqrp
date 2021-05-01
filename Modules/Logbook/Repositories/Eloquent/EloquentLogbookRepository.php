<?php

namespace Modules\Logbook\Repositories\Eloquent;

use Modules\Core\Repositories\Eloquent\EloquentBaseRepository;
use Modules\Logbook\Repositories\LogbookRepository;

class EloquentLogbookRepository extends EloquentBaseRepository implements LogbookRepository
{
    /**
     * Recover the latest contacts for this user
     * @return mixed
     */
    public function latestContacts()
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->first();

        return  $defaultLogBook->entries()->orderBy('qso_start', 'desc')->take(5)->get();
    }

    public function longestContacts()
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->distinct('call')->first();

        $logEntries =  $defaultLogBook->entries()->orderBy('distance_km', 'desc')->take(5)->get();
        $logEntries = $logEntries->unique('call');
        return $logEntries;
    }
}
