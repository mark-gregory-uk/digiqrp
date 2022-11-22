@extends('layouts.master')

@section('title')
    {{ $page->title }} | @parent
@stop
@section('meta')
    <meta name="title" content="{{ $page->meta_title}}" />
    <meta name="description" content="{{ $page->meta_description }}" />
@stop
@section('content')
    <div class="row">
        <h1 style="margin-left: 10px;">{{ $page->title }}</h1>
        <div style="margin-left: 25px;" class="page-body">{!! $page->body !!}</div>
    </div>
@stop
