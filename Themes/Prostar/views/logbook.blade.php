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
    td.details-control {
        background: url("{{ Theme::url('/img/system/details_open.png') }}") no-repeat center center;
        cursor: pointer;
    }
    tr.shown td.details-control {
        background: url("{{ Theme::url('/img/system/details_close.png') }}") no-repeat center center;
    }

</style>

@section('content')
    <div class="well">
    <div>
        <h3>Current Digital Mode Log Entries ({{ count($contacts) }})</h3>
        <p>{!! $page->body !!}</p>
        <br/>
    </div>

    <div style="overflow-x:auto;">
        <table id="logbook" class="table table-striped table-bordered table-responsive table-condensed data-table responsive nowrap hover" width="100%!important">
            <thead>
            <tr>
                <th></th>
                <th>Call</th>
                <th>RST</th>
                <th>Mode</th>
                <th>Band</th>
                <th>&nbsp;</th>
                <th>Date</th>
            </tr>
            </thead>
        </table>
      </div>
    </div>

    <script type="text/javascript">
        function format ( d ) {
            // `d` is the original data object for the row
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                '<td>Call:</td>'+
                '<td>'+d.call+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Country:</td>'+
                '<td>'+d.dxcc_country+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Date:</td>'+
                '<td>'+d.qso_end+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Received RST:</td>'+
                '<td>'+d.rst_received+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Sent RST:</td>'+
                '<td>'+d.rst_sent+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Mode:</td>'+
                '<td>'+d.mode+'</td>'+
                '</tr>'+
                '<td>Band:</td>'+
                '<td>'+d.band_tx+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td>Distance:</td>'+
                '<td>'+d.distance_km+'&nbsp;km &nbsp;'+d.distance_miles+'&nbsp;miles</td>'+
                '</tr>'+
                '</table>';
        }
        $(document).ready(function() {
            var table = $('#logbook').DataTable({
                ordering: true,
                'order': [[ 5, "desc" ]],
                responsive: window.innerWidth < 700 ? true : false,
                'columnDefs' : [
                    { 'visible':window.innerWidth < 700 ? false : true, 'targets': [2,3] }
                ],
                ajax: "{{ route('logbook.all') }}",
                scrollY:        350,
                scrollCollapse: true,
                columns: [
                    {
                        className:      'details-control',
                        orderable:      false,
                        data:           null,
                        defaultContent: ''
                    },
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

                ]
            });

        $('#logbook tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
      });
    </script>
    <div class="well">
    <canvas id="calls" width="400" height="200"></canvas>
    <script>
        var ctx = document.getElementById('calls').getContext('2d');
        var callsChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Stations Worked',
                    data: [],
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 2,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 1,
                    pointRadius: 1,
                    pointHitRadius: 5,
                    snapGaps:false,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {

                        },
                        grid:{
                            display:false
                        }
                    },
                    x: {
                        grid:{
                            display:false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
        var data = data || {};
        $.getJSON("{{ route('logbook.stats') }}", data).done(function(response) {
            callsChart.data.datasets[0].data = response.data; // or you can iterate for multiple datasets
            callsChart.update(); // finally update our chart
        });
    </script>
    </div>
    <div class="well">

        @map([
        'lat' => 52.38475,
        'lng' => -1.81982,
        'zoom' => 6,
        $markers,
        ])

@stop
