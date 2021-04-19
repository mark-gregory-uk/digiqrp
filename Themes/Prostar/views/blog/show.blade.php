@extends('layouts.master')

@section('title')
    {{ $post->title }} | @parent
@stop

@section('content')

    <script>
        $(document).ready(function(){
            val = "{!!  'Created By: '. $post->created_at->format('d-m-Y').' '.$post->author->full_name . ' '. $post->author->callsign !!}";
            $(".breadcrumb").text(val);
        });
    </script>

    <div class="row">
        <div class="col-lg-12">
        <h1 style="margin-left: 10px;">{{ $post->title }}</h1>
        <div style="margin-left: 25px;">
        {!! $post->content !!}
    </div>
@stop

