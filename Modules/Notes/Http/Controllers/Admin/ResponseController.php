<?php

namespace Modules\Notes\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Notes\Entities\Response;
use Modules\Notes\Http\Requests\CreateResponseRequest;
use Modules\Notes\Http\Requests\UpdateResponseRequest;
use Modules\Notes\Repositories\ResponseRepository;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;

class ResponseController extends AdminBaseController
{
    /**
     * @var ResponseRepository
     */
    private $response;

    public function __construct(ResponseRepository $response)
    {
        parent::__construct();

        $this->response = $response;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //$responses = $this->response->all();

        return view('notes::admin.responses.index', compact(''));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('notes::admin.responses.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateResponseRequest $request
     * @return Response
     */
    public function store(CreateResponseRequest $request)
    {
        $this->response->create($request->all());

        return redirect()->route('admin.notes.response.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('notes::responses.title.responses')]));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Response $response
     * @return Response
     */
    public function edit(Response $response)
    {
        return view('notes::admin.responses.edit', compact('response'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Response $response
     * @param  UpdateResponseRequest $request
     * @return Response
     */
    public function update(Response $response, UpdateResponseRequest $request)
    {
        $this->response->update($response, $request->all());

        return redirect()->route('admin.notes.response.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('notes::responses.title.responses')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Response $response
     * @return Response
     */
    public function destroy(Response $response)
    {
        $this->response->destroy($response);

        return redirect()->route('admin.notes.response.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('notes::responses.title.responses')]));
    }
}
