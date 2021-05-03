<?php

namespace Modules\Download\Repositories\Cache;

use Modules\Download\Repositories\DownloadRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheDownloadDecorator extends BaseCacheDecorator implements DownloadRepository
{
    public function __construct(DownloadRepository $download)
    {
        parent::__construct();
        $this->entityName = 'download.downloads';
        $this->repository = $download;
    }
}
