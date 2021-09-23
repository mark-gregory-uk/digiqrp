<?php

namespace Modules\Notes\Repositories\Cache;

use Modules\Notes\Repositories\ResponseToResponseRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheResponseToResponseDecorator extends BaseCacheDecorator implements ResponseToResponseRepository
{
    public function __construct(ResponseToResponseRepository $responsetoresponse)
    {
        parent::__construct();
        $this->entityName = 'notes.responsetoresponses';
        $this->repository = $responsetoresponse;
    }
}
