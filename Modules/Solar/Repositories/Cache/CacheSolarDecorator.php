<?php

namespace Modules\Solar\Repositories\Cache;

use Modules\Core\Repositories\Cache\BaseCacheDecorator;
use Modules\Solar\Repositories\SolarRepository;

class CacheSolarDecorator extends BaseCacheDecorator implements SolarRepository
{
    public function __construct(SolarRepository $solar)
    {
        parent::__construct();
        $this->entityName = 'solar.solars';
        $this->repository = $solar;
    }

    public function latestReports()
    {
        $this->repository->latestReports();
    }
}
