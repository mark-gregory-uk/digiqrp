<?php

namespace Modules\CallBook\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CallBookController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Renderable
     */
    public function index()
    {
        return view('callbook::index');
    }

    /**
     * Show the form for creating a new resource.
     * @return Renderable
     */
    public function create()
    {
        return view('callbook::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Renderable
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function show($id)
    {
        return view('callbook::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function edit($id)
    {
        return view('callbook::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Renderable
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Renderable
     */
    public function destroy($id)
    {
        //
    }


    public function lookup(Request $request){

        $call = $request->get('callSign');
        if ($call){
            $dataPath = module_path('CallBook').'/Libraries/cty.dat';
            if (file_exists(module_path('CallBook').'/Libraries/dxcc.pl')){
                exec('/usr/bin/perl '.module_path('CallBook').'/Libraries/dxcc.pl '.$call .' '.$dataPath,$output);
                return response()->json(['call'=>$output[0],'country'=>$output[3],'continent' => $output[6]]);
            }
        }
    }
}
