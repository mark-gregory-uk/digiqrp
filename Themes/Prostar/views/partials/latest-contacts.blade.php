@if (!empty($latestContacts))
    <div class="well ">
        <h3 class="page-header">latest Contacts</h3>
        <ul class="mostread mod-list">
            @foreach($latestContacts as $contact)
                <li itemscope="" itemtype="https://schema.org/Article">
                            <span itemprop="name">
                            @if($contact->country_slug)
                                    <img src="{{ Theme::url('img/flags/png/'.strtolower($contact->country_slug).'.png') }}">
                                @endif
                                {!! '<span>'.$contact->call.'</span><span>&nbsp;</span><span style="float:right;">'.$contact->band_rx.'</span>' !!}</span>
                </li>
            @endforeach


        </ul>
    </div>
@endif
