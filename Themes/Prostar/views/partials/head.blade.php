<head lang="{{ LaravelLocalization::setLocale() }}">
    <meta charset="UTF-8">
    @section('meta')
        <meta name="description" content="@setting('core::site-description')"/>
    @show
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="generator" content="laravel - Open Source Content Management" />
    <title>@section('title')@setting('core::site-name')@show</title>
    @if(isset($alternate))
        @foreach($alternate as $alternateLocale=>$alternateSlug)
            <link rel="alternate" hreflang="{{$alternateLocale}}" href="{{url($alternateLocale.'/'.$alternateSlug)}}">
        @endforeach
    @endif
    <link rel="canonical" href="{{url()->current()}}" />
    <link rel="shortcut icon" href="{{ Theme::url('favicon.ico') }}">

    {!! Theme::style('css/main.css') !!}
    @stack('css-stack')

    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
    <link href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css" rel="stylesheet">

    <style>
        h1, h2, h3, h4, h5, h6, .site-title {
            font-family: 'Open Sans', sans-serif;
        }
        body.site {
            border-top: 3px solid #0088cc;
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

    {!! Theme::script('js/all.js') !!}
    @yield('scripts')
    <script src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>

</head>
