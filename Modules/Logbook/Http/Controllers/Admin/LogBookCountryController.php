<?php

namespace Modules\Logbook\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;
use Modules\Logbook\Entities\LogbookCountry;
use Modules\Logbook\Entities\LogbookEntry;
use Modules\Logbook\Http\Requests\CreateLogbookCountryRequest;
use Modules\Logbook\Http\Requests\UpdateLogbookCountryRequest;
use Modules\Logbook\Repositories\LogbookCountryRepository;

class LogBookCountryController extends AdminBaseController
{
    /**
     * @var LogbookCountryRepository
     */
    private $logbookCountryRepository;

    public function __construct(LogbookCountryRepository $logbookCountryRepository)
    {
        parent::__construct();
        $this->logbookCountryRepository = $logbookCountryRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $countries = LogbookCountry::all();

        return view('logbook::admin.countries.index', compact('countries'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param LogbookCountry $logbookCountry
     *
     * @return Response
     */
    public function edit(LogbookCountry $logbookCountry)
    {
        return view('logbook::admin.countries.edit', compact('logbookCountry'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('logbook::admin.countries.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreateLogbookCountryRequest $request
     *
     * @return Response
     */
    public function store(CreateLogbookCountryRequest $request)
    {
        $data = $request->all();
        $this->logbookCountryRepository->create($data);

        return redirect()->route('admin.logbook.countries.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('logbook::countries.title.country')]));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param LogbookCountry       $logbookCountry
     * @param UpdateLogbookCountryRequest $request
     *
     * @return Response
     */
    public function update(LogbookCountry $logbookCountry, UpdateLogbookCountryRequest $request)
    {
        $this->logbookCountryRepository->update($logbookCountry, $request->all());

        return redirect()->route('admin.logbook.countries.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('logbook::countries.title.country')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param LogbookCountry $logbookCountry
     *
     * @return Response
     */
    public function destroy(LogbookCountry $logbookCountry)
    {
        $this->logbookCountryRepository->destroy($logbookCountry);

        return redirect()->route('admin.logbook.countries.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('logbook::countries.title.country')]));
    }
}
