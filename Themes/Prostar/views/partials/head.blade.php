<head lang="{{ LaravelLocalization::setLocale() }}">
    <meta charset="UTF-8">
    <meta http-equiv="Cache-Control:max-age=31536000"/>
    <meta name="description" content="@setting('core::site-description')"/>
    <meta name="keywords" content="@setting('core::site-meta-keywords')"/>
    <meta name="theme-color" content="@setting('core::site-theme-color')"/>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="generator" content="laravel - Open Source Content Management" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="msapplication-TileColor" content="#da532c">

    <title style="font-family: 'Open Sans', sans-serif;">@section('title')@setting('core::site-name')@show</title>

    <link rel="apple-touch-icon" sizes="180x180" href="{{ Theme::url('/icons/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ Theme::url('/icons/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ Theme::url('/icons/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ Theme::url('/icons/site.webmanifest') }}">
    <link rel="mask-icon" href="{{ Theme::url('/icons/safari-pinned-tab.svg') }}" color="#5bbad5">


    @if(isset($alternate))
        @foreach($alternate as $alternateLocale=>$alternateSlug)
            <link rel="alternate" hreflang="{{$alternateLocale}}" href="{{url($alternateLocale.'/'.$alternateSlug)}}">
        @endforeach
    @endif

    <link rel="canonical" href="{{url()->current()}}" />
    <link rel="shortcut icon" href="{{ Theme::url('favicon.ico').'?v=2' }}">

    {!! Theme::style('css/main.css') !!}
    @stack('css-stack')

    <style>
        h1, h2, h3, h4, h5, h6, .site-title {
            font-family: 'Open Sans', sans-serif;
        }
        body.site {
            border-top: 4px solid #FFA500;
            background-color: #f4f6f7;
        }
        a {
            color:  #0088cc;
        }
        .nav-list > .active > a,
        .nav-list > .active > a:hover,
        .dropdown-menu li > a:hover,
        .dropdown-menu .active > a,
        .dropdown-menu .active > a:hover,
        .nav-pills > .active > a,
        .nav-pills > .active > a:hover,
        .btn-primary {
            background:  #0088cc;
        }
        div.mod_search87 input[type="search"]{ width:auto; }
    </style>

    <link  href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
    <link  href="https://cdn.datatables.net/1.10.24/css/jquery.dataTables.min.css" rel="stylesheet">
    <link  href="https://cdn.datatables.net/responsive/2.2.7/css/responsive.dataTables.min.css" rel="stylesheet">

    <style>
        h1, h2, h3, h4, h5, h6, .site-title {
            font-family: 'Open Sans', sans-serif;
        }
        body.site {
            border-top: 4px solid #FFA500;
            background-color: #f4f6f7;
        }
        a {
            color: #0088cc;
        }
        .nav-list > .active > a,
        .nav-list > .active > a:hover,
        .dropdown-menu li > a:hover,
        .dropdown-menu .active > a,
        .dropdown-menu .active > a:hover,
        .nav-pills > .active > a,
        .nav-pills > .active > a:hover,
        .btn-primary {
            background: #0088cc;
        }
        div.mod_search87 input[type="search"]{ width:auto; }
    </style>

    @mapstyles

    {!! Theme::script('js/all.js') !!}
    {!! Theme::script('js/chart.js') !!}
    @yield('scripts')

</head>
