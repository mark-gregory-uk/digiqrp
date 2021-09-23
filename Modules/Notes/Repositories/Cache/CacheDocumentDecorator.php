<?php

namespace Modules\Notes\Repositories\Cache;

use Modules\Notes\Repositories\DocumentRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheDocumentDecorator extends BaseCacheDecorator implements DocumentRepository
{
    public function __construct(DocumentRepository $document)
    {
        parent::__construct();
        $this->entityName = 'notes.documents';
        $this->repository = $document;
    }
}
