<?php

namespace Modules\Solar\Repositories\Cache;

use Modules\Solar\Repositories\SolarRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheSolarDecorator extends BaseCacheDecorator implements SolarRepository
{
    public function __construct(SolarRepository $solar)
    {
        parent::__construct();
        $this->entityName = 'solar.solars';
        $this->repository = $solar;
    }
}
