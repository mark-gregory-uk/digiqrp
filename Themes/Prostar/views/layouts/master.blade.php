<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr">

    @include('partials.head')

    <body class="site com_content view-category layout-blog no-task itemid-101">
        <div class="body" id="top">
            <div class="container">
                @include('partials.header')
                <p>&copy; 2020-2021 DigiQRP &amp; G4LCH&nbsp;&nbsp;
                    <span style="margin-right: -4px;font-size: 11px;font-weight: bold;background-color:  #555555; color:whitesmoke;border-top-left-radius: 3px;border-bottom-left-radius: 4px;padding-left: 3px;padding-right: 3px;padding-top: 3px;padding-bottom: 3px;">Version</span>
                    <span style="font-size: 11px;font-weight: bold;background-color:#6ec83f; color:whitesmoke;border-top-right-radius: 4px;border-bottom-right-radius: 4px;padding: 3px;" >{{Version::nocommit()}}</span>
                    @include('cookieConsent::index')
                </p>
                @include('partials.navigation')
            <!-- Begin Breadcrumbs -->
              @include('partials.bread-crumb')
            <!-- End Breadcrumbs -->
                <div class="row-fluid">
                    <main id="content" role="main" class="span9">
                    <!-- Begin Content -->
                    @include('partials.header-image')

                    <div id="system-message-container">
                       @include('partials.system-messages')
                    </div>
                    <div class="blog" itemscope itemtype="https://schema.org/Blog">
                        @yield('content')
                    </div>
                <!-- End Content -->
            </main>
            <div id="aside" class="span3">
                <!-- Begin Right Sidebar -->
                @include('partials.calllookup')

                @include('partials.latest-posts')
                @include('partials.latest-contacts')

                @include('partials.furthest-contacts')
                @if (Request::path() != 'welcome' and Request::path() != '/')
                  @include('partials.logchart')
                  @include('partials.solar-report')
                @endif
                @if ( (Request::path() != 'welcome') and (Request::path() != 'logbook-stats') and Request::path() != '/')
                    @include('partials.sunspot-trend')
                @endif

                @include('partials.blog-feed')

                <!-- End Right Sidebar -->
            </div>
             <div>@include('partials.footer')</div>
        </div>

        <?php if (Setting::has('core::analytics-script')): ?>
            {!! Setting::get('core::analytics-script') !!}
        <?php endif; ?>

        @stack('js-stack')

       @include('partials.footer-scripts')

       @mapscripts

    </body>

</html>
