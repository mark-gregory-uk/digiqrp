<?php

namespace Modules\Logbook\Repositories\Cache;

use Modules\Core\Repositories\Cache\BaseCacheDecorator;
use Modules\Logbook\Repositories\LogbookRepository;

class CacheLogbookDecorator extends BaseCacheDecorator implements LogbookRepository
{
    public function __construct(LogbookRepository $logbook)
    {
        parent::__construct();
        $this->entityName = 'logbook.logbooks';
        $this->repository = $logbook;
    }

    public function latestContacts()
    {
        return $this->repository->latestContacts();
    }
}
