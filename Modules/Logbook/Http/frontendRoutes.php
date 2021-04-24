<?php

Route::get('logentries', 'LogbookController@all')->name('logbook.all');

Route::get('/upload-file', [\Modules\Logbook\Http\Controllers\Admin\LogbookController::class, 'createForm']);

Route::post('/upload-file', [\Modules\Logbook\Http\Controllers\Admin\LogbookController::class, 'fileUpload'])->name('fileUpload');
