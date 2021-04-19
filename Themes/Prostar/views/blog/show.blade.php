@extends('layouts.master')

@section('title')
    {{ $post->title }} | @parent
@stop

@section('content')
    <div class="row">
        <div class="col-lg-12">

        <h1 style="margin-left: 10px;">{{ $post->title }}</h1>
        <div style="margin-left: 25px;">
        {!! $post->content !!}
        </div>
            <span style="margin-left: 25px;" class="date">{{ 'Created '.$post->created_at->format('d-m-Y').' '.$post->author->full_name . ' '. $post->author_callsign  }}</span>
        </div>
    </div>
@stop
