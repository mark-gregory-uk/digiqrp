@if (! empty($latestSolarReports))
    <div class="well">
        <h3 class="page-header">Latest Solar Report </h3>
        <ul class="category-module mod-list">
            <div>
                <table style="width:100%;margin-left: -17px;/* text-align: left; */display: inline-table;">
                    <thead>
                    <tr>
                        <th style="text-align: left;font-size: 13px;!important;">Band</th>
                        <th style="text-align: left;font-size: 13px;!important;">Day</th>
                        <th style="text-align: left;font-size: 13px;!important;">Night</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($latestSolarReports->reports as $report)
                        <tr>
                            <td style="font-size: 13px;!important;">{{ $report->name }}</td>
                            <td style="font-size: 13px;!important; color: {{ ($report->night_condx == 'Poor' ? 'red':($report->night_condx == 'Fair' ? 'darkorange':'green')) }}">{{ $report->day_condx }}</td>
                            <td style="font-size: 13px;!important; color: {{ ($report->night_condx == 'Poor' ? 'red':($report->night_condx == 'Fair' ? 'darkorange':'green')) }}">{{ $report->night_condx }}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </ul>
        <h3 class="page-header">Geomagnatic Field</h3>
        <p>{{$latestSolarReports->geomagfield}}</p>
    </div>
@endif
