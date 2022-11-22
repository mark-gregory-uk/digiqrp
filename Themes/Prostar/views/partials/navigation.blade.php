
<nav class="navigation" role="navigation">
    <div class="navbar pull-left">
        <a style="margin-bottom: -12px;" class="btn btn-navbar collapsed" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </a>
    </div>
    <div class="nav-collapse">
            {!! Menu::get('Main','App\Presenters\BasicMenuPresenter') !!}
    </div>
</nav>
