<?php

namespace Modules\Logbook\Http\Controllers;


use Illuminate\Contracts\Support\Renderable;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\View;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Entities\LogbookEntry;
use Yajra\DataTables\Facades\DataTables;


class LogbookController extends Controller
{

    /**
     * Display the default Logbook view
     * @param Request $request
     * @return \Illuminate\Contracts\View\View
     */
    public function index(Request $request){
        return View::make('logbook');
    }


    /**
     * Ajax Method for displaying the logbook entries
     * @param Request $request
     * @return mixed
     * @throws \Exception
     */
    public function all(Request $request){

        if ($request->ajax()) {
            $logbook = Logbook::where('owner_id','=',1)->first();
            $data = LogbookEntry::where('parent_id','=',$logbook->id)->orderBy('qso_end', 'desc')->get();


            return Datatables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    $btn = '<a href="javascript:void(0)" class="edit btn btn-primary btn-sm">View</a>';
                    return $btn;
                })
                ->rawColumns(['action'])
                ->make(true);
        }

    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function show($id)
    {
        return view('logbook::show',compact('logEntries'));
    }

}
