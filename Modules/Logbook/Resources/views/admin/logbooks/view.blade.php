@extends('layouts.master')

@section('content-header')
    <h1>
        {{ trans('logbook::logbooks.title.edit logbook') }}
    </h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('dashboard.index') }}"><i class="fa fa-dashboard"></i> {{ trans('core::core.breadcrumb.home') }}</a></li>
        <li><a href="{{ route('admin.logbook.logbook.index') }}">{{ trans('logbook::logbooks.title.logbooks') }}</a></li>
        <li class="active">{{ trans('logbook::logbooks.title.edit logbook') }}</li>
    </ol>
@stop


@section('content')

    @include('logbook::admin.logbooks.modals.upload-logfile')
    @include('logbook::admin.logbooks.modals.upload-adif')

    <div class="nav-tabs-custom">
        <ul class="nav nav-tabs">

            <li class="active"><a href="#tab_logbook" data-toggle="tab">Logbook</a></li>
            <li class=""><a href="#tab_entries" data-toggle="tab">Entries</a></li>

        </ul>
        <div class="tab-content">
            <div class="row">
                <div class="btn-group pull-right" style="margin: 0 15px 15px 0;">
                    <a data-toggle="modal" data-target="#upload-logfile" class="btn btn-success btn-rounded" style="padding: 4px 10px;">
                        <i class="fa fa-upload"></i>Upload Log File
                    </a>
                </div>
                <div class="btn-group pull-right" style="margin: 0 15px 15px 0;">
                    <a data-toggle="modal" data-target="#upload-adif" class="btn btn-danger btn-rounded" style="padding: 4px 10px;">
                        <i class="fa fa-upload"></i>Upload ADIF File
                    </a>
                </div>
            </div>
            <div class="tab-pane active" id="tab_logbook">
                <div class="box-body">

                    {!! Form::open(['route' => ['admin.logbook.logbook.update', $logbook->id], 'method' => 'put','id' => 'logbook']) !!}
                    @include('partials.form-tab-headers')
                    <div class="tab-content">
                        <?php $i = 0; ?>
                        @foreach (LaravelLocalization::getSupportedLocales() as $locale => $language)
                            <?php $i++; ?>
                            <div class="tab-pane {{ locale() == $locale ? 'active' : '' }}" id="tab_{{ $i }}">
                                @include('logbook::admin.logbooks.partials.view-fields', ['lang' => $locale])
                            </div>
                        @endforeach
                        {!! Form::close() !!}

                    </div>
                </div>
                <div class="box-footer">
                    <button type="button" class="btn btn-primary btn-rounded" onclick="location.href='{{ route('admin.logbook.logbook.edit',[$logbook->id]) }}'">{{ trans('logbook::logbooks.button.edit') }}</button>
                    <a class="btn btn-danger pull-right btn-rounded" href="{{ route('admin.logbook.logbook.index')}}">
                        <i class="fa fa-times"></i> {{ trans('core::core.button.cancel') }}
                    </a>
                </div>
            </div>
            <div class="tab-pane" id="tab_entries">
                <div class="box-body">
                    <div class="row">
                        <div class="btn-group pull-right" style="margin: 0 15px 15px 0;">
                    </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row">
                                @include('logbook::admin.logbooks.partials.logentries')
                            </div>
                        </div>
                    </div>
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
        <dt><code>b</code></dt>
        <dd>{{ trans('core::core.back to index') }}</dd>
    </dl>
@stop


@push('js-stack')
    <script type="text/javascript">
        $( document ).ready(function() {
            $(document).keypressAction({
                actions: [
                    { key: 'b', route: "<?= route('admin.logbook.logbook.index') ?>" }
                ]
            });
        });
        function submitform() {
            document.getElementById("logbook").submit();
        }
    </script>
    <script>
        $( document ).ready(function() {
            $('#upload-logfile').modal('hide');
            $('input[type="checkbox"].flat-blue, input[type="radio"].flat-blue').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });
        });
        <?php $locale = locale(); ?>

    </script>
    <script type="text/javascript">
        $(function () {
            $('.data-table').dataTable({
                "paginate": true,
                "lengthChange": true,
                "filter": true,
                "sort": true,
                "info": true,
                "autoWidth": true,
                "order": [[ 0, "desc" ]],
                "language": {
                    "url": '<?php echo Module::asset("core:js/vendor/datatables/{$locale}.json") ?>'
                }
            });
        });
    </script>
@endpush


