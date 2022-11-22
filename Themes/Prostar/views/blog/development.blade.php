@extends('layouts.master')

@section('title')
    Blog posts | @parent
@stop

@section('content')
    <div class="row">
        <div class="col-md-12">
            <h1 style="margin-left: 10px;">Development Projects</h1>
            <?php if (isset($posts)): ?>
            <ul style="margin-left: 40px;">
                <?php foreach ($posts as $post): ?>
                    <li>
                        <h3><a href="{{ URL::route($currentLocale . '.blog.slugByCategory', [$post->category,$post->slug]) }}">{{ $post->title }}</a></h3>
                        @if(! empty($post))
                            <div class="moduletable">
                                <div class="custom"  >
                                    <p>
                                        @if ($post -> files()->count()>0)
                                            <img style="width: 10%;" src="{{ $post -> files() -> where("zone", "thumbnail") -> first() -> path }}" alt="{{ $post->title }}" />
                                        @endif

                                    </p>
                                </div>
                            </div>
                        @endif
                    </li>
                    <div class="card-body d-flex flex-column align-items-start">
                        <p class="card-text mb-auto">{!! \Illuminate\Support\Str::limit($post->content, 220, $end='...') !!}</p>
                        <a href="{{ URL::route($currentLocale . '.blog.slugByCategory', [$post->category,$post->slug]) }}">Continue reading</a>
                    </div>
                    <div class="clearfix"></div>
                <?php endforeach; ?>
            </ul>
            <?php endif; ?>
        </div>
    </div>
@stop
