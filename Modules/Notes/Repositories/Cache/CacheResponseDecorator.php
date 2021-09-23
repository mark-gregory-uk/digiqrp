<?php

namespace Modules\Notes\Repositories\Cache;

use Modules\Notes\Repositories\ResponseRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheResponseDecorator extends BaseCacheDecorator implements ResponseRepository
{
    public function __construct(ResponseRepository $response)
    {
        parent::__construct();
        $this->entityName = 'notes.responses';
        $this->repository = $response;
    }
}
