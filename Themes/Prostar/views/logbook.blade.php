@extends('layouts.master')

@section('title')
    {{ $page->title }} | @parent
@stop
@section('meta')
    <meta name="title" content="{{ $page->meta_title}}" />
    <meta name="description" content="{{ $page->meta_description }}" />
@stop

<script>
    window.setTimeout(function () {
        window.location.reload();
    }, 120000);
</script>

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
        <h3>Current Digital Mode Log Entries</h3>
        <p>These are live multi-band low power log entries for G4LCH using Xeigu G90 and multi-band vertical. </p>
        <br/>
    </div>

    <div style="overflow-x:auto;">
        <table  id="logbook" class="table table-striped table-bordered table-responsive table-condensed data-table responsive nowrap" width="100%!important">
            <thead>
            <tr>
                <th>Call</th>
                <th>RST</th>
                <th>SST</th>
                <th>Band</th>
                <th></th>
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
        window.onresize = function(){ location.reload(); }
        $(function () {
            var table = $('#logbook').DataTable({
                ordering: true,
                "order": [[ 4, "desc" ]],
                processing: true,
                responsive: window.innerWidth < 700 ? true : false,
                'columnDefs' : [
                    { 'visible':window.innerWidth < 700 ? false : true, 'targets': [1,2,4,5] }
                ],
                language: {
                    processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> '
                },
                serverSide: true,

                ajax: "{{ route('logbook.all') }}",
                columns: [
                    { data: 'call',
                        name: 'call'
                    },
                    { data: 'rst_received',
                        name: 'rst_received'
                    },
                    { data: 'rst_sent',
                        name: 'rst_sent'

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
                    {
                        data: 'dxcc_country',
                        name: 'dxcc_country',
                               'searchable':true,
                               'visible':false,
                    },

                ]
            });
        });
    </script>
@stop
