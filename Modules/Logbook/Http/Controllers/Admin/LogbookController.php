<?php

namespace Modules\Logbook\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Modules\Blog\Entities\Post;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogFile;
use Modules\Logbook\Entities\MacLogger;
use Modules\Logbook\Http\Requests\CreateLogbookRequest;
use Modules\Logbook\Http\Requests\UpdateLogbookRequest;
use Modules\Logbook\Repositories\LogbookRepository;

class LogbookController extends AdminBaseController
{
    /**
     * @var LogbookRepository
     */
    private $logbook;

    /**
     * @var Post
     */
    private $postRepository;

    public function __construct(LogbookRepository $logbook, PostRepository  $postsRepository)
    {
        parent::__construct();
        $this->postRepository = $postsRepository;
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

    /**
     * Upload a logbook and import into database
     * @param Request $request
     */
    public function logbookUploader(Request $request)
    {
    }

    public function createForm()
    {
        $latestPosts = $this->postRepository->latest();
        $latestContacts = $this->logbook->latestContacts();

        return view('logbook::admin.logbooks.fileupload', compact('latestPosts', 'latestContacts'));
    }

    public function fileUpload(Request $req)
    {
        $fileModel = new LogFile();

        if ($req->file()) {
            $originalFileName =  $req->file->getClientOriginalName();
            $fileName = time() . '_' . $originalFileName;
            $filePath = $req->file('file')->storeAs('uploads', $fileName, 'public');

            $fileModel->name = time() . '_' . $req->file->getClientOriginalName();
            $fileModel->file_path = '/storage/' . $filePath;
            $fileModel->save();

            if (Storage::exists('database/sqlite/' . $originalFileName)) {
                Storage::delete('database/sqlite/' . $originalFileName);
            }

            Storage::move('/storage/app/public/uploads/' . $fileModel->name, 'database/sqlite/' . $originalFileName);

            if ($originalFileName == 'MacLoggerDX.sql') {
                $logbook = Logbook::with('entries')
                    ->where('owner_id', '=', 1)
                    ->where('slug', '=', 'main')->first();

                $logEntries = $logbook->entries()->get();

                foreach ($logEntries as $logEntry) {
                    $logEntry->delete();
                }

                $macLoggerRecords = Maclogger::all();

                foreach ($macLoggerRecords as $row) {
                    $logEntry = $logbook->entries()->create();
                    $logEntry->call = $row->call;
                    $logEntry->first_name = $row->first_name;
                    $logEntry->last_name = $row->last_name;
                    $logEntry->dxcc_country = $row->dxcc_country;
                    $logEntry->grid = $row->grid;
                    $logEntry->band_rx = $row->band_rx;
                    $logEntry->band_tx = $row->band_tx;
                    $logEntry->rst_sent = $row->rst_sent;
                    $logEntry->rst_received = $row->rst_received;
                    $logEntry->comments = $row->comments;
                    $logEntry->qso_start = $row->qso_start;
                    $logEntry->qso_end = $row->qso_done;
                    $logEntry->lat = $row->latitude;
                    $logEntry->lng = $row->longitude;
                    $logEntry->power = $row->power;
                    $logEntry->tx_frequency = $row->tx_frequency;
                    $logEntry->rx_frequency = $row->rx_frequency;
                    $logEntry->dxcc_id = $row->dxcc_id;
                    $logEntry->save();
                }
            }

            return back()
                ->with('success', 'Logfile has been uploaded and imported')
                ->with('file', $fileName);
        } else {
            return back()
                ->with('errors', 'Logfile has not been uploaded.');
        }
    }
}
