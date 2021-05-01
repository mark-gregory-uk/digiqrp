<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr">

    @include('partials.head')

    <body class="site com_content view-category layout-blog no-task itemid-101">
        <div class="body" id="top">
            <div class="container">
                @include('partials.header')

                @include('partials.navigation')

                <div class="row-fluid">
            <main id="content" role="main" class="span9">
                <!-- Begin Content -->
                    @include('partials.header-image')

                    <!-- include('layouts.partials.prostar.breadcrumb') -->

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
                @include('partials.latest-posts')
                @include('partials.latest-contacts')
                @include('partials.furthest-contacts')
                @include('partials.solar-report')
                @include('partials.blog-feed')
                <!-- End Right Sidebar -->
            </div>

        </div>
                <!-- Begin Breadcrumbs -->
                @include('partials.bread-crumb')
                <!-- End Breadcrumbs -->
            </div>
        </div>

        @include('partials.footer')

        <?php if (Setting::has('core::analytics-script')): ?>
            {!! Setting::get('core::analytics-script') !!}
        <?php endif; ?>

        @stack('js-stack')

       @include('partials.footer-scripts')
</body>

</html>
