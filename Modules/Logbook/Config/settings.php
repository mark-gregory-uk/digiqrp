<?php

return [
    'latitude' => [
        'description'  => 'Default Latitude',
        'view'         => 'text',
        'translatable' => true,
    ],
    'longitude'  => [
        'description'  => 'Default Longitude',
        'view'         => 'text',
        'translatable' => true,
    ],
    'maxcount' => [
        'description'  => 'Maximum number of longest contacts returned',
        'view'         => 'number',
        'translatable' => false,
        'default'       => 5,
    ],

    'maxcontacts' => [
        'description'  => 'Maximum number of contacts returned listed',
        'view'         => 'number',
        'translatable' => false,
        'default'      => 6,
    ],

];
