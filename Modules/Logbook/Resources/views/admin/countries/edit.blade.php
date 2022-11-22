@extends('layouts.master')

@section('content-header')
    <h1>
        {{ trans('logbook::countries.title.edit logbook') }}
    </h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('dashboard.index') }}"><i class="fa fa-dashboard"></i> {{ trans('core::core.breadcrumb.home') }}</a></li>
        <li><a href="{{ route('admin.logbook.countries.index') }}">{{ trans('logbook::countries.title.countries') }}</a></li>
        <li class="active">{{ trans('logbook::countries.title.edit country') }}</li>
    </ol>
@stop


@section('content')

    <div class="nav-tabs-custom">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#tab_details" data-toggle="tab">Country Details</a></li>

        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="tab_details">
                <div class="box-body">

                    {!! Form::open(['route' => ['admin.logbook.countries.update', $logbookCountry->id], 'method' => 'put','id' => 'country']) !!}
                    @include('partials.form-tab-headers')
                    <div class="tab-content">
                        <?php $i = 0; ?>
                        @foreach (LaravelLocalization::getSupportedLocales() as $locale => $language)
                            <?php $i++; ?>
                            <div class="tab-pane {{ locale() == $locale ? 'active' : '' }}" id="tab_{{ $i }}">
                                @include('logbook::admin.countries.partials.edit-fields', ['lang' => $locale])
                            </div>
                        @endforeach
                        {!! Form::close() !!}

                    </div>
                </div>
                <div class="box-footer">
                    <button type="button" onclick="submitform()" class="btn btn-primary btn-flat">{{ trans('core::core.button.update') }}</button>
                    <a class="btn btn-danger pull-right btn-flat" href="{{ route('admin.logbook.countries.index')}}">
                        <i class="fa fa-times"></i> {{ trans('core::core.button.cancel') }}
                    </a>
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
                    { key: 'b', route: "<?= route('admin.logbook.countries.index') ?>" }
                ]
            });
        });
        function submitform() {
            document.getElementById("country").submit();
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

@endpush


