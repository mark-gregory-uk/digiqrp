<!DOCTYPE html>
<html>
    @include('partials.head')
<body>
    @include('partials.header')

<div class="container">
    @yield('content')
</div>
@include('partials.footer')
    <?php if (Setting::has('core::analytics-script')): ?>
        {!! Setting::get('core::analytics-script') !!}
    <?php endif; ?>
    @stack('js-stack')
</body>
</html>
