@if (!empty($latestPosts))
    <div class="well">
        <a href="/blog/posts"><h3 class="page-header">Latest Posts</h3></a>
        <ul class="category-module mod-list">
            @foreach($latestPosts as $post)
                <li>
                    <a class="mod-articles-category-title " href="{{ URL::route($currentLocale . '.blog.slug', [$post->slug]) }}">{{$post->title}}</a>
                </li>
            @endforeach
        </ul>
    </div>
@endif
