<?php

namespace Modules\Logbook\Repositories;

use Modules\Core\Repositories\BaseRepository;

interface LogbookRepository extends BaseRepository
{
    public function latestContacts();

    //public function longestContacts();
}
