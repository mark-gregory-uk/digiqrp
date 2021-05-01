<?php

namespace Modules\Solar\Repositories\Cache;

use Modules\Core\Repositories\Cache\BaseCacheDecorator;
use Modules\Solar\Entities\SolarBandData;
use Modules\Solar\Repositories\SolarDataRowRepository;

class CacheSolarDataRowDecorator extends BaseCacheDecorator implements SolarDataRowRepository
{
    public function __construct(SolarBandData $solarBandData)
    {
        parent::__construct();
        $this->entityName = 'solar.solarbanddata';
        $this->repository = $solarBandData;
    }
}
