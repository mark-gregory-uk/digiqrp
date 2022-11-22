@extends('layouts.master')

@section('title')
    {{ $post->title }} | @parent
@stop

@section('content')

    @if(! empty($post))
        <div class="moduletable">
            <div class="custom"  >
                <p>
                    @if ($post -> files()->count()>0)
                        <img class="header-img" src="{{ $post -> files() -> where("zone", "thumbnail") -> first() -> path }}" alt="" />
                    @endif

                </p>
            </div>
        </div>
    @endif

    <div class="row">
        <div class="col-lg-12">
        <h1 style="margin-left: 10px;">{{ $post->title }}</h1>
        <div style="margin-left: 25px;">
        {!! $post->content !!}
    </div>
@stop

