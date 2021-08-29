@if (!empty($furthestContacts))
    <div class="well ">
        <h3 class="page-header">Longest HF Distance</h3>
        <ul class="mostread mod-list">
            @foreach($furthestContacts as $contact)
                <li itemscope="" itemtype="https://schema.org/Article">
                    @if($contact->country_slug)
                        <img src="{{ Theme::url('img/flags/png/'.strtolower($contact->country_slug).'.png') }}">
                    @endif
                    <span itemprop="name">{!! '&nbsp;&nbsp;<span>'.$contact->call.'</span><span>&nbsp;</span><span style="float:right;">'.round($contact->distance_km).' Km</span>' !!}
                </li>
            @endforeach
        </ul>
    </div>
@endif
