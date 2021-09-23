<?php

namespace Modules\Notes\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Notes\Entities\ResponseToResponse;
use Modules\Notes\Http\Requests\CreateResponseToResponseRequest;
use Modules\Notes\Http\Requests\UpdateResponseToResponseRequest;
use Modules\Notes\Repositories\ResponseToResponseRepository;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;

class ResponseToResponseController extends AdminBaseController
{
    /**
     * @var ResponseToResponseRepository
     */
    private $responsetoresponse;

    public function __construct(ResponseToResponseRepository $responsetoresponse)
    {
        parent::__construct();

        $this->responsetoresponse = $responsetoresponse;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //$responsetoresponses = $this->responsetoresponse->all();

        return view('notes::admin.responsetoresponses.index', compact(''));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('notes::admin.responsetoresponses.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateResponseToResponseRequest $request
     * @return Response
     */
    public function store(CreateResponseToResponseRequest $request)
    {
        $this->responsetoresponse->create($request->all());

        return redirect()->route('admin.notes.responsetoresponse.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('notes::responsetoresponses.title.responsetoresponses')]));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  ResponseToResponse $responsetoresponse
     * @return Response
     */
    public function edit(ResponseToResponse $responsetoresponse)
    {
        return view('notes::admin.responsetoresponses.edit', compact('responsetoresponse'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  ResponseToResponse $responsetoresponse
     * @param  UpdateResponseToResponseRequest $request
     * @return Response
     */
    public function update(ResponseToResponse $responsetoresponse, UpdateResponseToResponseRequest $request)
    {
        $this->responsetoresponse->update($responsetoresponse, $request->all());

        return redirect()->route('admin.notes.responsetoresponse.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('notes::responsetoresponses.title.responsetoresponses')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  ResponseToResponse $responsetoresponse
     * @return Response
     */
    public function destroy(ResponseToResponse $responsetoresponse)
    {
        $this->responsetoresponse->destroy($responsetoresponse);

        return redirect()->route('admin.notes.responsetoresponse.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('notes::responsetoresponses.title.responsetoresponses')]));
    }
}
