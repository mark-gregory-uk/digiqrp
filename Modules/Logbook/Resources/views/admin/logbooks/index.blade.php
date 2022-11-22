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
                <div class="btn-group pull-right" style="margin: 0 15px 15px 0;">
                    <a href="{{ route('admin.logbook.logbook.create') }}" class="btn btn-primary btn-flat" style="padding: 4px 10px;">
                        <i class="fa fa-pencil"></i> {{ trans('logbook::logbooks.button.create logbook') }}
                    </a>
                </div>
            </div>
            <div class="box box-primary">
                <div class="box-header">
                </div>
                <!-- /.box-header -->
                <div class="box-body">
                    <div class="table-responsive">
                        <table class="data-table table table-bordered table-hover">
                            <thead>
                            <tr>
                                <th>{{ trans('logbook::logbooks.table.title') }}</th>
                                <th>{{ trans('logbook::logbooks.table.owner') }}</th>
                                <th>{{ trans('core::core.table.created at') }}</th>
                                <th data-sortable="false">{{ trans('core::core.table.actions') }}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php if (isset($logbooks)) { ?>
                            <?php foreach ($logbooks as $logbook) { ?>
                            <tr>
                                <td>
                                    <a href="{{ route('admin.logbook.logbook.view', [$logbook->id]) }}">
                                        {{ $logbook->title }}
                                    </a>
                                </td>
                                <td>
                                    <a href="{{ route('admin.logbook.logbook.edit', [$logbook->id]) }}">
                                        {{ $logbook->owner() }}
                                    </a>
                                </td>
                                <td>
                                    <a href="{{ route('admin.logbook.logbook.edit', [$logbook->id]) }}">
                                        {{ $logbook->created_at }}
                                    </a>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <a href="{{ route('admin.logbook.logbook.view', [$logbook->id]) }}" class="btn btn-default btn-rounded btn-info"><i class="fa fa-book"></i></a>
                                        <a href="{{ route('admin.logbook.logbook.edit', [$logbook->id]) }}" class="btn btn-default btn-rounded btn-success"><i class="fa fa-pencil"></i></a>
                                        <button class="btn btn-danger btn-rounded" data-toggle="modal" data-target="#modal-delete-confirmation" data-action-target="{{ route('admin.logbook.logbook.destroy', [$logbook->id]) }}"><i class="fa fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                            <?php } ?>
                            <?php } ?>
                            </tbody>
                        </table>
                        <!-- /.box-body -->
                    </div>
                </div>
                <!-- /.box -->
            </div>
        </div>
    </div>
    @include('core::partials.delete-modal')
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

@push('js-stack')
    <script type="text/javascript">
        $( document ).ready(function() {
            $(document).keypressAction({
                actions: [
                    { key: 'c', route: "<?= route('admin.logbook.logbook.create') ?>" }
                ]
            });
        });
    </script>
    <?php $locale = locale(); ?>
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
