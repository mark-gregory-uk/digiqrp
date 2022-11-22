@extends('layouts.master')

@section('title')
    {{ $page->title }} | @parent
@stop
@section('meta')
    <meta name="title" content="{{ $page->meta_title}}" />
    <meta name="description" content="{{ $page->meta_description }}" />
@stop

@section('content')
    <div class="well">
    <div>
        <h3>Current Digital Mode Log Statistics</h3>
        <p>{!! $page->body !!}</p>
        <br/>
    </div>
    <div style="overflow-x:auto;">
        <canvas id="stats" width="400" height="200"></canvas>
        <script>
            var ctx = document.getElementById('stats').getContext('2d');
            var statsChart = new Chart(ctx, {
                type: 'bar',
                data: {

                    datasets: [{
                        label: 'Worked',
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
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        snapGaps:false,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: () => ('')
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
                            display: false
                        }
                    }
                }
            });
            var data = data || {};
            $.getJSON("{{ route('logbook.stats') }}", data).done(function(response) {
                statsChart.data.datasets[0].data = response.data; // or you can iterate for multiple datasets
                statsChart.update(); // finally update our chart
            });
        </script>
    </div>
    </div>
    @if (! empty($latestSolarReports))
        @if (count($latestSolarReports->reports)>30)
            <div class="well">
            @include('partials.sunspots')
        @endif
    @endif


@stop
