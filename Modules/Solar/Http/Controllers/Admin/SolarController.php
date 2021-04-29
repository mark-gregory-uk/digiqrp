<?php

namespace Modules\Solar\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Solar\Entities\Solar;
use Modules\Solar\Http\Requests\CreateSolarRequest;
use Modules\Solar\Http\Requests\UpdateSolarRequest;
use Modules\Solar\Repositories\SolarRepository;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;

class SolarController extends AdminBaseController
{
    /**
     * @var SolarRepository
     */
    private $solar;

    public function __construct(SolarRepository $solar)
    {
        parent::__construct();

        $this->solar = $solar;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $solarReports = $this->solar->all();

        return view('solar::admin.solars.index', compact('solarReports'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('solar::admin.solars.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateSolarRequest $request
     * @return Response
     */
    public function store(CreateSolarRequest $request)
    {
        $this->solar->create($request->all());

        return redirect()->route('admin.solar.solar.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('solar::solars.title.solars')]));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Solar $solar
     * @return Response
     */
    public function edit(Solar $solar)
    {
        return view('solar::admin.solars.edit', compact('solar'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Solar $solar
     * @param  UpdateSolarRequest $request
     * @return Response
     */
    public function update(Solar $solar, UpdateSolarRequest $request)
    {
        $this->solar->update($solar, $request->all());

        return redirect()->route('admin.solar.solar.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('solar::solars.title.solars')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Solar $solar
     * @return Response
     */
    public function destroy(Solar $solar)
    {
        $this->solar->destroy($solar);

        return redirect()->route('admin.solar.solar.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('solar::solars.title.solars')]));
    }
}