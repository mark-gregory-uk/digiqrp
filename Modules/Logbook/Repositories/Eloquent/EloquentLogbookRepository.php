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
    public function totalContacts($maxContacts=null)
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->first();

        return  $defaultLogBook->entries()->orderBy('qso_start', 'desc')->get();
    }


    /**
     * Recover the latest contacts for this user.
     * @return mixed
     */
    public function latestContacts($maxContacts=null)
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->first();

        return  $defaultLogBook->entries()->orderBy('qso_start', 'desc')->take(($maxContacts >0 ? $maxContacts : 5))->get();
    }

    /**
     * get longest contacts
     * @param Integer $maxCount
     * @return mixed
     */
    public function longestContacts($maxCount=null)
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->distinct('call')->first();

        $logEntries = $defaultLogBook->entries()->orderBy('distance_km', 'desc')->take(($maxCount >0 ? $maxCount : 3))->get();
        $logEntries = $logEntries->unique('call');

        return $logEntries;
    }



    /**
     * get longest contacts
     * @param Integer $maxCount
     * @return mixed
     */
    public function contactsForMap()
    {
        $user = 1;
        $defaultLogBook = $this->where('owner_id', $user)->where('default', true)->distinct('call')->first();

        $logEntries = $defaultLogBook->entries()->where('distance_km','>',3000 )->get();
        $logEntries = $logEntries->unique('call');

        return $logEntries;
    }


}
