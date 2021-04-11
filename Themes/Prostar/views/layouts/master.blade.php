<!DOCTYPE html>
<html>
    @include('partials.head')
<body class="site com_content view-category layout-blog no-task itemid-101">
    @include('partials.header')

    @include('partials.navigation')

    <div class="row-fluid">
        <main id="content" role="main" class="span9">
            <!-- Begin Content -->
            <div class="moduletable">
                <div class="custom"  >
                    <p>
                        <img src="{{ Theme::url('img/headers/keyboard-1385706_1280.jpg')}}" alt="" />
                    </p>
                </div>
            </div>


            <!-- include('layouts.partials.prostar.breadcrumb') -->

            <div id="system-message-container"></div>

            <div class="blog" itemscope itemtype="https://schema.org/Blog">

                @yield('content')

            </div>

            <!-- End Content -->

        </main>

        <div id="aside" class="span3">
            <!-- Begin Right Sidebar -->

            <!-- End Right Sidebar -->
        </div>
    </div>



    @include('partials.footer')

    <?php if (Setting::has('core::analytics-script')): ?>
        {!! Setting::get('core::analytics-script') !!}
    <?php endif; ?>
    @stack('js-stack')
</body>
</html>
