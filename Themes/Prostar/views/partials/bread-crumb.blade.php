<div aria-label="Breadcrumbs" role="navigation">
    <ul itemscope="" itemtype="https://schema.org/BreadcrumbList" class="breadcrumb">

        @if (Route::current()->getName() === 'homepage' )
            <li>
                You are here: Home
            </li>
        @else
            <li>
                You are here:
            </li>
        @endif

        <li itemprop="itemListElement" itemscope="" itemtype="https://schema.org/ListItem" class="active">
            <span style="  padding-left: 0px;" class="breadcrumb" id="breadcrumb" itemprop="name"></span>
            <meta itemprop="position" content="1">
        </li>
    </ul>
</div>
