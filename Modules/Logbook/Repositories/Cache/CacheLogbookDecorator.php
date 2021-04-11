<?php

namespace Modules\Logbook\Repositories\Cache;

use Modules\Logbook\Repositories\LogbookRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheLogbookDecorator extends BaseCacheDecorator implements LogbookRepository
{
    public function __construct(LogbookRepository $logbook)
    {
        parent::__construct();
        $this->entityName = 'logbook.logbooks';
        $this->repository = $logbook;
    }
}
