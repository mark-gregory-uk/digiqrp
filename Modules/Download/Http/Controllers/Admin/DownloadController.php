<?php

namespace Modules\Download\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;
use Modules\Download\Entities\Download;
use Modules\Download\Http\Requests\CreateDownloadRequest;
use Modules\Download\Http\Requests\UpdateDownloadRequest;
use Modules\Download\Repositories\DownloadRepository;

class DownloadController extends AdminBaseController
{
    /**
     * @var DownloadRepository
     */
    private $download;

    public function __construct(DownloadRepository $download)
    {
        parent::__construct();

        $this->download = $download;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $downloads = $this->download->all();

        return view('download::admin.downloads.index', compact('downloads'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('download::admin.downloads.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateDownloadRequest $request
     * @return Response
     */
    public function store(CreateDownloadRequest $request)
    {
        $this->download->create($request->all());

        return redirect()->route('admin.download.download.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('download::downloads.title.downloads')]));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Download $download
     * @return Response
     */
    public function edit(Download $download)
    {
        return view('download::admin.downloads.edit', compact('download'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Download $download
     * @param  UpdateDownloadRequest $request
     * @return Response
     */
    public function update(Download $download, UpdateDownloadRequest $request)
    {
        $this->download->update($download, $request->all());

        return redirect()->route('admin.download.download.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('download::downloads.title.downloads')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Download $download
     * @return Response
     */
    public function destroy(Download $download)
    {
        $this->download->destroy($download);

        return redirect()->route('admin.download.download.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('download::downloads.title.downloads')]));
    }
}
