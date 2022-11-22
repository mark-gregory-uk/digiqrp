@if (! empty($latestSolarReports))
    @if (count($latestSolarReports->reports)>30)
        <div class="well ">
            @include('partials.sunspots-well')
        </div>
    @endif
@endif