<?php

namespace Modules\Solar\Repositories;

use Modules\Core\Repositories\BaseRepository;

interface SolarRepository extends BaseRepository
{
    public function latestReports();
    public function all();
}
