<?php

namespace Modules\Logbook\Http\Controllers\Admin;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;
use Modules\Logbook\Entities\LogbookEntry;
use Modules\Logbook\Http\Requests\UpdateLogbookEntryRequest;
use Modules\Logbook\Repositories\LogbookEntryRepository;

class LogBookEntryController extends AdminBaseController
{
    /**
     * @var LogbookEntryRepository
     */
    private $logbookEntryRepository;

    public function __construct(LogbookEntryRepository $logbookEntryRepository)
    {
        parent::__construct();
        $this->logbookEntryRepository = $logbookEntryRepository;
    }

    /**
     * @param LogbookEntry $entry
     * @return Response
     */
    public function edit(LogbookEntry $entry)
    {
        return view('logbook::admin.logentries.edit', compact('entry'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param LogbookEntry       $entry
     * @param UpdateLogbookEntryRequest $request
     *
     * @return Response
     */
    public function update(LogbookEntry $entry, UpdateLogbookEntryRequest $request)
    {
        $this->logbookEntryRepository->update($entry, $request->all());

        return redirect()->back()
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('logbook::entry.title.entry')]));
    }
}
