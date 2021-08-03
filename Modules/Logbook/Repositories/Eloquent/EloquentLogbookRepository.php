<?php

namespace Modules\Logbook\Repositories\Eloquent;

use Modules\Core\Repositories\Eloquent\EloquentBaseRepository;
use Modules\Logbook\Repositories\LogbookEntryRepository;
use Modules\Logbook\Repositories\LogbookRepository;
use Modules\Setting\Entities\Setting;
use phpDocumentor\Reflection\Types\Integer;


class EloquentLogbookRepository extends EloquentBaseRepository implements LogbookRepository
{
    private $setting;




    /**
     * Recover the latest contacts for this user.
     * @return mixed
     */
    public function latestContacts()
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->first();

        return  $defaultLogBook->entries()->orderBy('qso_start', 'desc')->take(5)->get();
    }

    /**
     * get longest contacts
     * @param Integer $maxCount
     * @return mixed
     */
    public function longestContacts()
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->distinct('call')->first();
        $maxCount = 8;
        $logEntries = $defaultLogBook->entries()->orderBy('distance_km', 'desc')->take(($maxCount >0 ? $maxCount : 6))->get();
        $logEntries = $logEntries->unique('call');

        return $logEntries;
    }
}
