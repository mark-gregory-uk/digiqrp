@extends('layouts.master')

@section('content-header')
    <h1>
        {{ trans('dashboard::dashboard.name') }}
    </h1>
@stop

@section('styles')

@stop

@section('content')
    <div class="row">
        <div class="col-md-12">
            @if (setting('dashboard::welcome-enabled') === '1')
                <div class="box box-primary">
                    <div class="box-header">
                        <h3 class="box-title">
                            @setting('dashboard::welcome-title')
                        </h3>
                    </div>
                    <div class="box-body">
                        <p>@setting('dashboard::welcome-description')</p>
                        <div class="row">
                            <div class="col-md-5 col-sm-6 col-xs-12">
                                <div class="info-box">
                                    <div class="info-box-content">
                                        <div style="overflow-x:auto;">
                                            <canvas id="sunspots" style="width:100%;max-width:700px"></canvas>
                                            <script>
                                                var ctx = document.getElementById('sunspots').getContext('2d');
                                                var sChart = new Chart(ctx, {
                                                    type: 'line',
                                                    data: {
                                                        labels: [],
                                                        datasets: [
                                                            {
                                                                label: 'Sunspots',
                                                                data: [],
                                                                lineTension: 0.1,
                                                                backgroundColor: "rgba(75,192,92,221)",
                                                                borderColor: "rgba(75,192,92,221)",
                                                                borderCapStyle: 'butt',
                                                                borderDash: [],
                                                                borderDashOffset: 0.0,
                                                                borderJoinStyle: 'miter',
                                                                pointBorderColor: "rgba(75,92,192,1)",
                                                                pointBackgroundColor: "#fff",
                                                                pointBorderWidth: 1,
                                                                pointHoverRadius: 5,
                                                                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                                                pointHoverBorderWidth: 2,
                                                                pointRadius: 1,
                                                                pointHitRadius: 10,
                                                                snapGaps:false,
                                                            },
                                                            {
                                                                label: 'Magnetic Field',
                                                                data: [],
                                                                lineTension: 0.1,
                                                                backgroundColor: "rgba(255,0,92,45.4)",
                                                                borderColor: "rgba(255,0,92,221)",
                                                                borderCapStyle: 'butt',
                                                                borderDash: [],
                                                                borderDashOffset: 0.0,
                                                                borderJoinStyle: 'miter',
                                                                pointBorderColor: "rgba(75,92,192,1)",
                                                                pointBackgroundColor: "#fff",
                                                                pointBorderWidth: 1,
                                                                pointHoverRadius: 5,
                                                                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                                                pointHoverBorderWidth: 2,
                                                                pointRadius: 1,
                                                                pointHitRadius: 10,
                                                                snapGaps:false,
                                                            }
                                                        ]
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
                                                                display: true
                                                            }
                                                        }
                                                    }
                                                });
                                                var data = data || {};
                                                $.getJSON("{{ route('solar.sunspots') }}", data).done(function(response) {
                                                    sChart.data.labels = response.titles;
                                                    sChart.data.datasets[0].data = response.data; // or you can iterate for multiple datasets
                                                    sChart.data.datasets[1].data = response.magfield;
                                                    sChart.update(); // finally update our chart
                                                });
                                            </script>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    @if (setting('core::site-name') === '')
                        <div class="box-footer">
                            <a class="btn btn-primary btn-flat" href="{{ route('dashboard.module.settings', 'core') }}">
                                <i class="fa fa-cog"></i> {{ trans('dashboard::dashboard.configure your website') }}
                            </a>
                            <a class="btn btn-default btn-flat" href="{{ route('admin.page.page.index') }}">
                                {{ trans('dashboard::dashboard.add pages') }}
                            </a>
                            <a class="btn btn-default btn-flat" href="{{ route('admin.menu.menu.index') }}">
                                {{ trans('dashboard::dashboard.add menus') }}
                            </a>
                        </div>
                    @endif
                </div>
            @endif
        </div>
    </div>
@stop
