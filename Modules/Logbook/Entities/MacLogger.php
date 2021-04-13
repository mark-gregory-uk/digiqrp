<?php

namespace Modules\Logbook\Entities;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Maclogger extends Model
{
    protected $connection = 'maclogger';

    protected $table = 'qso_table_v007';

    protected $dates = [
        'created_at',
        'updated_at',
        'qso_start',
        'qso_done',
    ];

    protected $dateFormat = 'd-m-Y h:s';
}
