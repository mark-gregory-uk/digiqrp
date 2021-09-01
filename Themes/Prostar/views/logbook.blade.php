@extends('layouts.master')

@section('title')
    {{ $page->title }} | @parent
@stop
@section('meta')
    <meta name="title" content="{{ $page->meta_title}}" />
    <meta name="description" content="{{ $page->meta_description }}" />
@stop



<style>
    table.dataTable >tbody td {
        background-color: #fcf8e3;
        border-color: #faebcc;
        color: #8a6d3b;
    }

    table.dataTable > tbody tr.odd td {
        background-color: #dff0d8;
        border-color: #d6e9c6;
        color: #3c763d;
    }
    table.dataTable{
        margin: 0;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 13px;
        line-height: 18px;
        color: #333;

    }

</style>

@section('content')
    <div class="well">
    <div>
        <h3>Current Digital Mode Log Entries ({{ count($contacts) }})</h3>
        {!! $page->body !!}
        <br/>
    </div>

    <div style="overflow-x:auto;">
        <table  id="logbook" class="table table-striped table-bordered table-responsive table-condensed data-table responsive nowrap" width="100%!important">
            <thead>
            <tr>
                <th>Call</th>
                <th>RST</th>
                <th>Mode</th>
                <th>Band</th>
                <th>&nbsp;</th>
                <th>Date</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    </div>
    <script type="text/javascript">
        //window.onresize = function(){ location.reload(); }
        $(function () {
            var table = $('#logbook').DataTable({
                ordering: true,
                'order': [[ 4, "desc" ]],
                processing: true,
                responsive: window.innerWidth < 700 ? true : false,
                'columnDefs' : [
                    { 'visible':window.innerWidth < 700 ? false : true, 'targets': [1,2] }
                ],
                language: {
                    processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> '
                },
                serverSide: true,

                ajax: "{{ route('logbook.all') }}",
                columns: [
                    { data: 'call',
                        name: 'call',
                        "searchable": true,
                        "orderable": false,
                    },
                    { data: 'rst_received',
                        name: 'rst_received'
                    },
                    { data: 'mode',
                        name: 'mode'

                    },
                    { data: 'band_tx',
                        name: 'band_tx'
                    },
                    { data: 'payload',
                        name: 'payload',
                        "searchable": false,
                        "orderable": false,
                        render: function(data) {
                            return '<img src="'+data+'">'
                        },
                    },
                    { data: 'end_date',
                        name: 'end_date',
                        "searchable": true,
                        "orderable": true,
                    },
                    { data: 'end_time',
                        name: 'end_time',
                        "searchable": false
                    },


                ]
            });
        });
    </script>
@stop
