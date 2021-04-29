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
            @if(! empty($page))
            <div class="moduletable">
                <div class="custom"  >
                    <p>
                        @if ($page -> files()->count()>0)
                           <img src="{{ $page -> files() -> where("zone", "image") -> first() -> path }}" alt="" />
                        @endif

                    </p>
                </div>
            </div>
        @endif

        <!-- include('layouts.partials.prostar.breadcrumb') -->

        <div id="system-message-container"></div>

        <div class="blog" itemscope itemtype="https://schema.org/Blog">

            @yield('content')

        </div>

            <!-- End Content -->

        </main>

        <div id="aside" class="span3">
            <!-- Begin Right Sidebar -->
            <div class="well">
                <h3 class="page-header">Latest Posts</h3>
                <ul class="category-module mod-list">
                    @foreach($latestPosts as $post)
                        <li>
                            <a class="mod-articles-category-title " href="{{ URL::route($currentLocale . '.blog.slug', [$post->slug]) }}">{{$post->title}}</a>
                        </li>
                    @endforeach
                </ul>
            </div>
            <div class="well ">
                <h3 class="page-header">latest Contacts</h3>
                <ul class="mostread mod-list">
                    @foreach($latestContacts as $contact)
                        <li itemscope="" itemtype="https://schema.org/Article">
                            <span itemprop="name">{!! '<span>'.$contact->call.'</span><span>&nbsp;</span><span style="float:right;">'.$contact->band_rx.'</span>' !!}</span>
                        </li>
                    @endforeach


                </ul>
            </div>
            @if (! empty($latestSolarReports))
                <div class="well">
                <h3 class="page-header">Latest Solar Report </h3>
                <ul class="category-module mod-list">
                    <li itemscope="" itemtype="https://schema.org/Article">
                        <span itemprop="source">{!! 'Source: '.$latestSolarReports->source !!}</span>
                    </li>
                    <li itemscope="" itemtype="https://schema.org/Article">
                        <span itemprop="noise">{!! 'Noise Level: '.$latestSolarReports->noise_level !!}</span>
                    </li>
                    <li itemscope="" itemtype="https://schema.org/Article">
                        <span itemprop="updated">{!! $latestSolarReports->updated_at !!}</span>
                    </li>
                    <div>

                        <table style="width:100%;margin-left: -17px;/* text-align: left; */display: inline-table;">
                            <thead>
                            <tr>
                                <th style="text-align: left;font-size: 13px;!important;">Band</th>
                                <th style="text-align: left;font-size: 13px;!important;">Day</th>
                                <th style="text-align: left;font-size: 13px;!important;">Night</th>
                            </tr>
                            </thead>
                            <tbody>

                            @foreach($latestSolarReports->reports as $report)
                                <tr>
                                    <td style="font-size: 13px;!important;">{{ $report->name }}</td>
                                    <td style="font-size: 13px;!important; color: {{ ($report->night_condx == 'Poor' ? 'red':($report->night_condx == 'Fair' ? 'darkorange':'green')) }}">{{ $report->day_condx }}</td>
                                    <td style="font-size: 13px;!important; color: {{ ($report->night_condx == 'Poor' ? 'red':($report->night_condx == 'Fair' ? 'darkorange':'green')) }}">{{ $report->night_condx }}</td>
                                </tr>

                            @endforeach



                            </tbody>
                        </table>


                    </div>

                </ul>
            </div>
            @endif
            <!-- End Right Sidebar -->
        <div class="well ">
                <a href="#?format=feed&amp;type=rss" class="syndicate-module">
                    <img src="{{  asset('/img/system/livemarks.png') }}" alt="feed-image" />
                    <span>My Blog</span>
                </a>
            </div>
        </div>
    </div>
        <!-- Begin Breadcrumbs -->
        <div aria-label="Breadcrumbs" role="navigation">
            <ul itemscope="" itemtype="https://schema.org/BreadcrumbList" class="breadcrumb">
                <li>
                    You are here: &nbsp;
                </li>

                <li itemprop="itemListElement" itemscope="" itemtype="https://schema.org/ListItem" class="active">
					<span class="breadcrumb" id="breadcrumb" itemprop="name"></span>
                    <meta itemprop="position" content="1">
                </li>
            </ul>
        </div>
        <!-- End Breadcrumbs -->
    </div>
    </div>

    @include('partials.footer')

    <?php if (Setting::has('core::analytics-script')): ?>
        {!! Setting::get('core::analytics-script') !!}
    <?php endif; ?>

    @stack('js-stack')

    <script>
        $(document).ready(function(){
            val = $('.nav li.active').text()
            $("#breadcrumb").text(val);
        });
    </script>

</body>

</html>
