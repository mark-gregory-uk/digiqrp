<?php

return [
    'logbook.logbooks' => [
        'index'   => 'logbook::logbooks.list resource',
        'create'  => 'logbook::logbooks.create resource',
        'view' => 'logbook::logbooks.view resource',
        'edit'    => 'logbook::logbooks.edit resource',
        'destroy' => 'logbook::logbooks.destroy resource',

    ],
    'logbook.countries' => [
        'index'   => 'logbook::countries.list resource',
        'create'  => 'logbook::countries.create resource',
        'edit'    => 'logbook::countries.edit resource',
        'destroy' => 'logbook::countries.destroy resource',
    ],
];
