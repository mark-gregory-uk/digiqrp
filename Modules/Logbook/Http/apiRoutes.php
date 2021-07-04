
<?php

use Illuminate\Routing\Router;

Route::group(['prefix' => '/v1', 'namespace' => 'v1'], function () {
    Route::post('logentry', 'LogbookController@store')->name('logentry');
    Route::post('maclogger', 'LogbookController@storeMacLogger')->name('maclogger');
    Route::post('logsync', 'LogbookController@syncLogEntries')->name('sync');
    Route::get('logentries', 'LogbookController@getLogEntries')->name('entries');
});
