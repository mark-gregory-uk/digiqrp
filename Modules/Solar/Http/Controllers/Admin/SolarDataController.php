<?php

namespace Modules\Solar\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Solar\Entities\SolarData;
use Modules\Solar\Http\Requests\CreateSolarDataRequest;
use Modules\Solar\Http\Requests\UpdateSolarDataRequest;
use Modules\Solar\Repositories\SolarDataRepository;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;

class SolarDataController extends AdminBaseController
{
    /**
     * @var SolarDataRepository
     */
    private $solardata;

    public function __construct(SolarDataRepository $solardata)
    {
        parent::__construct();

        $this->solardata = $solardata;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //$solardatas = $this->solardata->all();

        return view('solar::admin.solardatas.index', compact(''));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('solar::admin.solardatas.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateSolarDataRequest $request
     * @return Response
     */
    public function store(CreateSolarDataRequest $request)
    {
        $this->solardata->create($request->all());

        return redirect()->route('admin.solar.solardata.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('solar::solardatas.title.solardatas')]));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  SolarData $solardata
     * @return Response
     */
    public function edit(SolarData $solardata)
    {
        return view('solar::admin.solardatas.edit', compact('solardata'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  SolarData $solardata
     * @param  UpdateSolarDataRequest $request
     * @return Response
     */
    public function update(SolarData $solardata, UpdateSolarDataRequest $request)
    {
        $this->solardata->update($solardata, $request->all());

        return redirect()->route('admin.solar.solardata.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('solar::solardatas.title.solardatas')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  SolarData $solardata
     * @return Response
     */
    public function destroy(SolarData $solardata)
    {
        $this->solardata->destroy($solardata);

        return redirect()->route('admin.solar.solardata.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('solar::solardatas.title.solardatas')]));
    }
}
