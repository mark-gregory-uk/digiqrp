<?php

namespace Modules\Download\Repositories\Cache;

use Modules\Core\Repositories\Cache\BaseCacheDecorator;
use Modules\Download\Repositories\DownloadRepository;

class CacheDownloadDecorator extends BaseCacheDecorator implements DownloadRepository
{
    public function __construct(DownloadRepository $download)
    {
        parent::__construct();
        $this->entityName = 'download.downloads';
        $this->repository = $download;
    }
}
