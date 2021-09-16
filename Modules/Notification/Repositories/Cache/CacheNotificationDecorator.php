<?php

namespace Modules\Notification\Repositories\Cache;

use Modules\Notification\Repositories\NotificationRepository;
use Modules\Core\Repositories\Cache\BaseCacheDecorator;

class CacheNotificationDecorator extends BaseCacheDecorator implements NotificationRepository
{
    public function __construct(NotificationRepository $notification)
    {
        parent::__construct();
        $this->entityName = 'notification.notifications';
        $this->repository = $notification;
    }
}
