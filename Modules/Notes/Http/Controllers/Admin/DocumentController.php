<?php

namespace Modules\Notes\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Notes\Entities\Document;
use Modules\Notes\Http\Requests\CreateDocumentRequest;
use Modules\Notes\Http\Requests\UpdateDocumentRequest;
use Modules\Notes\Repositories\DocumentRepository;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;

class DocumentController extends AdminBaseController
{
    /**
     * @var DocumentRepository
     */
    private $document;

    public function __construct(DocumentRepository $document)
    {
        parent::__construct();

        $this->document = $document;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //$documents = $this->document->all();

        return view('notes::admin.documents.index', compact(''));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('notes::admin.documents.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateDocumentRequest $request
     * @return Response
     */
    public function store(CreateDocumentRequest $request)
    {
        $this->document->create($request->all());

        return redirect()->route('admin.notes.document.index')
            ->withSuccess(trans('core::core.messages.resource created', ['name' => trans('notes::documents.title.documents')]));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Document $document
     * @return Response
     */
    public function edit(Document $document)
    {
        return view('notes::admin.documents.edit', compact('document'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Document $document
     * @param  UpdateDocumentRequest $request
     * @return Response
     */
    public function update(Document $document, UpdateDocumentRequest $request)
    {
        $this->document->update($document, $request->all());

        return redirect()->route('admin.notes.document.index')
            ->withSuccess(trans('core::core.messages.resource updated', ['name' => trans('notes::documents.title.documents')]));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Document $document
     * @return Response
     */
    public function destroy(Document $document)
    {
        $this->document->destroy($document);

        return redirect()->route('admin.notes.document.index')
            ->withSuccess(trans('core::core.messages.resource deleted', ['name' => trans('notes::documents.title.documents')]));
    }
}
