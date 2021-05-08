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
use Modules\Logbook\Entities\LogbookCountry;
use Modules\Logbook\Entities\LogFile;
use Modules\Logbook\Entities\MacLogger;
use Modules\Logbook\Http\Requests\CreateLogbookRequest;
use Modules\Logbook\Http\Requests\UpdateLogbookRequest;
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
     * Upload a logbook and import into database.
     * @param Request $request
     */
    public function logbookUploader(Request $request)
    {
    }

    public function createForm($owner, $logbook)
    {
        $latestPosts = $this->postRepository->latest();
        $latestContacts = $this->logbook->latestContacts();

        return view('logbook::admin.logbooks.fileupload', compact('latestPosts', 'latestContacts', 'owner', 'logbook'));
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
                $logbook = Logbook::with('entries')
                    ->where('owner_id', '=', $owner)
                    ->where('slug', '=', $logbook->slug)->first();

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
                    $country = $countries->firstWhere('name', $row->dxcc_country);

                    if (! empty($country)) {
                        $logEntry->country_slug = $country->code;
                    }

                    $distanceKM = (float) $this->distance($latitude, $longitude, $row->latitude, $row->longitude);
                    if ($distanceKM > 0) {
                        $distanceMiles = $distanceKM / 1.609;
                        $logEntry->distance_km = $distanceKM;
                        $logEntry->distance_miles = $distanceMiles;
                    }
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
