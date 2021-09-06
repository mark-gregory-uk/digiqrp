<div>
    <h3>Magnetic Field (30 Days)</h3>
    <div style="overflow-x:auto;">
        <canvas id="flux" style="width:100%;max-width:700px"></canvas>
        <script>
            var ctx = document.getElementById('flux').getContext('2d');
            var fChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                        label: 'Solar Flux',
                        data: [],
                        lineTension: 0.1,
                        backgroundColor: "rgba(200,122,134,195.4)",
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
            $.getJSON("{{ route('solar.magneticfield') }}", data).done(function(response) {
                fChart.data.labels = response.titles;
                fChart.data.datasets[0].data = response.data; // or you can iterate for multiple datasets
                fChart.update(); // finally update our chart
            });
        </script>

    </div>
</div>