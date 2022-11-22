<?php

namespace Modules\Logbook\Repositories\Cache;

use Modules\Core\Repositories\Cache\BaseCacheDecorator;
use Modules\Logbook\Repositories\LogbookCountryRepository;

class CacheLogbookCountryDecorator extends BaseCacheDecorator implements LogbookCountryRepository
{
    public function __construct(LogbookCountryRepository $logbookCountry)
    {
        parent::__construct();
        $this->entityName = 'logbook.countries';
        $this->repository = $logbookCountry;
    }
}
