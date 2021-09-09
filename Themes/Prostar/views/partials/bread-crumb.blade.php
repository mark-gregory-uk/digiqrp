
@switch(basename(\Request::path()))
    @case ('welcome')
      {{ Breadcrumbs::render('home') }}
      @break
    @case ('logbook')
      {{ Breadcrumbs::render('logbook') }}
      @break
    @case ('posts')
          {{ Breadcrumbs::render('blog') }}
      @break
    @case ('blog/posts/category/software')
      {{ Breadcrumbs::render('software') }}
      @break
    @case ('xeigu-g90')
        {{ Breadcrumbs::render('xeigu-g90') }}
        @break
    @case ('blog/posts/about-digiqrp')
        {{ Breadcrumbs::render('about') }}
        @break
    @case ('contact-us')
        {{ Breadcrumbs::render('contact-us') }}
        @break
    @case ('logbook-stats')
        {{ Breadcrumbs::render('logstats') }}
        @break
    @case ('software')
    {{ Breadcrumbs::render('software') }}
    @break
    @default
       @if (strpos(basename(Request::url()), 'digiqrp') !== false)
           {{ Breadcrumbs::render('home') }}
       @else
           {{ Breadcrumbs::render('post') }}
       @endif

@endswitch


