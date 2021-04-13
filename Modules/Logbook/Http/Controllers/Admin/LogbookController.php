<?php

namespace Modules\Logbook\Http\Controllers\Admin;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Http\Requests\CreateLogbookRequest;
use Modules\Logbook\Http\Requests\UpdateLogbookRequest;
use Modules\Logbook\Repositories\LogbookRepository;

class LogbookController extends AdminBaseController
{
    /**
     * @var LogbookRepository
     */
    private $logbook;

    public function __construct(LogbookRepository $logbook)
    {
        parent::__construct();

        $this->logbook = $logbook;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $logbooks = $this->logbook->all();

        return view('logbook::admin.logbooks.index', compact('logbooks'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('logbook::admin.logbooks.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateLogbookRequest $request
     *
     * @return Response
     */
    public function store(CreateLogbookRequest $request)
    {
        $data = $request->all();
        $data['owner_id'] = Auth::id();
        $this->logbook->create($data);

        return redirect()->route('admin.logbook.logbook.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('logbook::logbooks.title.logbooks')]));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Logbook $logbook
     *
     * @return Response
     */
    public function edit(Logbook $logbook)
    {
        return view('logbook::admin.logbooks.edit', compact('logbook'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Logbook              $logbook
     * @param UpdateLogbookRequest $request
     *
     * @return Response
     */
    public function update(Logbook $logbook, UpdateLogbookRequest $request)
    {
        $this->logbook->update($logbook, $request->all());

        return redirect()->route('admin.logbook.logbook.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('logbook::logbooks.title.logbooks')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Logbook $logbook
     *
     * @return Response
     */
    public function destroy(Logbook $logbook)
    {
        $this->logbook->destroy($logbook);

        return redirect()->route('admin.logbook.logbook.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('logbook::logbooks.title.logbooks')]));
    }
}
