<?php

namespace Modules\Logbook\Http\Controllers\Admin;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Modules\Blog\Entities\Post;
use Modules\Blog\Repositories\PostRepository;
use Modules\CallBook\Http\Controllers\CallBookController;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookCountry;
use Modules\Logbook\Entities\LogFile;
use Modules\Logbook\Entities\MacLogger;
use Modules\Logbook\Http\Requests\CreateLogbookRequest;
use Modules\Logbook\Http\Requests\UpdateLogbookRequest;
use Modules\Logbook\Jobs\ProcessADIF;
use Modules\Logbook\Jobs\ProcessMacLogger;
use Modules\Logbook\Libraries\ADIF_Parser;
use Modules\Logbook\Repositories\LogbookRepository;
use Modules\Setting\Contracts\Setting;

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

    /**
     * @var Setting
     */
    private $settings;

    public function __construct(LogbookRepository $logbook, PostRepository $postsRepository)
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
     * Show the form for viewing the specified resource.
     *
     * @param Logbook $logbook
     * @return Response
     */
    public function view(Logbook $logbook)
    {
        return view('logbook::admin.logbooks.view', compact('logbook'));
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

    public function createForm($owner, $logbook)
    {
        $latestPosts = $this->postRepository->latest();
        $latestContacts = $this->logbook->latestContacts();

        //return view('logbook::admin.logbooks.fileupload', compact('latestPosts', 'latestContacts', 'owner', 'logbook'));

        return view('logbook::admin.logbooks.fileupload_dialog', compact('owner', 'logbook'));
    }

    /**
     * Upload the logfile and process it.
     * @param Request $req
     * @param Setting $settings
     * @param $owner
     * @param $logbook
     * @return \Illuminate\Http\RedirectResponse
     */
    public function fileUpload(Request $req, Setting $settings, $owner, $logbook)
    {
        $this->settings = $settings;
        $default_lat = 52.3848;
        $default_lng = 1.8215;
        $countries = LogbookCountry::all();

        $user_lat = $this->settings->get('logbook::latitude');
        $user_lng = $this->settings->get('logbook::longitude');

        if ($user_lat & $user_lng) {
            $latitude = $user_lat;
            $longitude = $user_lng;
        } else {
            $latitude = $default_lat;
            $longitude = $default_lng;
        }

        $fileModel = new LogFile();

        if ($req->file()) {
            $originalFileName = $req->file->getClientOriginalName();
            $fileName = time().'_'.$originalFileName;
            $filePath = $req->file('file')->storeAs('uploads', $fileName, 'public');

            $fileModel->name = time().'_'.$req->file->getClientOriginalName();
            $fileModel->file_path = '/storage/'.$filePath;
            $fileModel->save();

            if (Storage::exists('storage/sqlite/'.$originalFileName)) {
                Storage::delete('storage/sqlite/'.$originalFileName);
            }

            Storage::move('/storage/app/public/uploads/'.$fileModel->name, '/storage/sqlite/'.$originalFileName);

            if ($originalFileName == 'MacLoggerDX.sql') {
                ProcessMacLogger::dispatch($owner,$countries,$latitude,$longitude)->onQueue('adif');;
           }

            return back()
                ->with('success', 'Maclogger Logfile has been uploaded and importing')
                ->with('file', $fileName);
        } else {
            return back()
                ->with('errors', 'Logfile has not been uploaded.');
        }
    }

    /**
     * Upload a adif logbook and import into database.
     * @param Request $req
     * @param Setting $settings
     * @param $owner
     * @param $logbook
     */
    public function adifUpload(Request $request, Setting $settings, $owner, $logbook)
    {

        $fileModel = new LogFile();

        $logbook = Logbook::with('entries')
            ->where('owner_id', '=', $owner)
            ->where('slug', '=', 'main')->first();

        if ($request->file()) {
            $originalFileName = $request->file->getClientOriginalName();
            $fileName = time() . '_' . $originalFileName;
            $filePath = $request->file('file')->storeAs('uploads', $fileName, 'public');

            Storage::move('/storage/app/public/uploads/' . $fileName, '/storage/adif/' . $fileName);

            ProcessADIF::dispatch($logbook,$fileName)->onQueue('adif');;

            return back()
                ->with('success', 'ADIF has been uploaded and submitted for processing')
                ->with('file', $fileName);
        }

    }


    /**
     * Calculate the as the crow flies distance in miles and kilometers.
     * @param $lat1
     * @param $lon1
     * @param $lat2
     * @param $lon2
     * @return float|int
     */
    private function distance($lat1, $lon1, $lat2, $lon2)
    {
        $pi80 = M_PI / 180;
        $r = 6372.797; // mean radius of Earth in km
        $calculatedDistance = 0;
        if ((float) $lat2 != 0 && (float) $lon2 != 0) {
            $lat1 *= $pi80;
            $lon1 *= $pi80;
            $lat2 *= $pi80;
            $lon2 *= $pi80;
            $dlat = $lat2 - $lat1;
            $dlon = $lon2 - $lon1;
            $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $calculatedDistance = $r * $c;
        }

        return $calculatedDistance;
    }

}
