@if(! empty($page))
    <div class="moduletable">
        <div class="custom"  >
            <p>
                @if ($page -> files()->count()>0)
                    <img class="header-img" src="{{ $page -> files() -> where("zone", "image") -> first() -> path }}" alt="" />
                @endif
            </p>
        </div>
    </div>
@endif
