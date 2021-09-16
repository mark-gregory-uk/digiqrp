@if(@setting('blog::show_feed'))
    <div class="well ">
        <a href="#?format=feed&amp;type=rss" class="syndicate-module">
            <img src="{{  asset('/img/system/livemarks.png') }}" alt="feed-image" />
            <span>Blog</span>
        </a>
    </div>
@endif
