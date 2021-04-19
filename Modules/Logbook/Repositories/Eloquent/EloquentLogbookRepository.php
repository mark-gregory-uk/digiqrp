<?php

namespace Modules\Logbook\Repositories\Eloquent;

use Illuminate\Support\Facades\Auth;
use Modules\Core\Repositories\Eloquent\EloquentBaseRepository;
use Modules\Logbook\Repositories\LogbookRepository;

class EloquentLogbookRepository extends EloquentBaseRepository implements LogbookRepository
{
    public function latestContacts()
    {
        // First we get the default logbook for this user

        $user = 1;
        $defaultLogBook = $this->where('owner_id',$user)->where('default',true)->first();

        $entries = $defaultLogBook->entries()->orderBy('qso_start', 'desc')->take(5)->get();
        return $entries;



    }

}
