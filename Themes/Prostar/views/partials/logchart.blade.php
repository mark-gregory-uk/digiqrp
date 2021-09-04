@if (!empty($furthestContacts))
    <div class="well ">
        <h3 class="page-header">Regions</h3>
            <canvas id="countries" width="200" height="200"></canvas>
            <script>
                var ctx = document.getElementById('countries').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['USA', 'Russia', 'UK','EU', 'Other','Asia'],
                        datasets: [{
                            label: 'Worked',
                            data: [],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
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
                $.getJSON("{{ route('logbook.status') }}", data).done(function(response) {
                    //myChart.data.labels = response.labels;
                    myChart.data.datasets[0].data = response.data; // or you can iterate for multiple datasets
                    myChart.update(); // finally update our chart
                });
            </script>

    </div>

@endif
