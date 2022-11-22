<?php

namespace Modules\Logbook\Repositories\Cache;

use Modules\Core\Repositories\Cache\BaseCacheDecorator;
use Modules\Logbook\Repositories\LogbookEntryRepository;

class CacheLogbookEntryDecorator extends BaseCacheDecorator implements LogbookEntryRepository
{
    public function __construct(LogbookEntryRepository $logbookEntryRepository)
    {
        parent::__construct();
        $this->entityName = 'logbook.entry';
        $this->repository = $logbookEntryRepository;
    }
}
