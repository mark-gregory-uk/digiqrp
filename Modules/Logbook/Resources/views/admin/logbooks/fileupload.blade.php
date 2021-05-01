@extends('layouts.master')

@section('content-header')
    <h1>
        {{ trans('logbook::logbooks.title.logbooks') }}
    </h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('dashboard.index') }}"><i class="fa fa-dashboard"></i> {{ trans('core::core.breadcrumb.home') }}</a></li>
        <li class="active">{{ trans('logbook::logbooks.title.logbooks') }}</li>
    </ol>
@stop

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="row">
                <div style="width: 85%;" class="container">
                    <form action="{{route('logbook.upload')}}" method="post" enctype="multipart/form-data">
                        <h3 class="text-center mb-5">Upload File in Laravel</h3>
                        @csrf

                        <div class="custom-file">
                            <input type="file" name="file" class="custom-file-input" id="chooseFile">

                            <button  type="submit" name="submit" class="btn btn-primary btn-flat">
                                Upload Logbook File
                            </button>
                        </div>


                    </form>
                </div>
            </div>
        </div>
    </div>
@stop

@section('footer')
    <a data-toggle="modal" data-target="#keyboardShortcutsModal"><i class="fa fa-keyboard-o"></i></a> &nbsp;
@stop
@section('shortcuts')
    <dl class="dl-horizontal">
        <dt><code>c</code></dt>
        <dd>{{ trans('logbook::logbooks.title.create logbook') }}</dd>
    </dl>
@stop

