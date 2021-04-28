<?php

namespace Modules\Solar\Repositories\Cache;

use Modules\Solar\Repositories\SolarDataRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheSolarDataDecorator extends BaseCacheDecorator implements SolarDataRepository
{
    public function __construct(SolarDataRepository $solardata)
    {
        parent::__construct();
        $this->entityName = 'solar.solardatas';
        $this->repository = $solardata;
    }
}
