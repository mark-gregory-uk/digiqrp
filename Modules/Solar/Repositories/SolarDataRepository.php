<?php

namespace Modules\Solar\Repositories;

use Modules\Core\Repositories\BaseRepository;

interface SolarDataRepository extends BaseRepository
{
    public function latestReports();
}
