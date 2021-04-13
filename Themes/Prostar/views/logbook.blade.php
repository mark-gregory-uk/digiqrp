@extends('layouts.master')

@section('title')
    {{ $page->title }} | @parent
@stop
@section('meta')
    <meta name="title" content="{{ $page->meta_title}}" />
    <meta name="description" content="{{ $page->meta_description }}" />
@stop

<script>
    window.setTimeout(function () {
        window.location.reload();
    }, 120000);
</script>

<style>
    table.dataTable >tbody td {
        background-color: #fcf8e3;
        border-color: #faebcc;
        color: #8a6d3b;
    }

    table.dataTable > tbody tr.odd td {
        background-color: #dff0d8;
        border-color: #d6e9c6;
        color: #3c763d;
    }
    table.dataTable{
        margin: 0;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 13px;
        line-height: 18px;
        color: #333;

    }

</style>


@section('content')
    <div>
        <h3>Current Digital Mode Log Entries</h3>
        <p>These are live multi-band low power log entries for G4LCH using Xeigu G90 and multi-band vertical. </p>
        <br/>
    </div>

    <div class="items-leading clearfix">
        <table style="margin-left: 5px;margin-right: 7px;" class="table table-bordered table-striped data-table">
            <thead>
            <tr>
                <th>Call</th>
                <th>RST</th>
                <th>SST</th>
                <th>Band</th>
                <th>Country</th>
                <th>Date</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>

    <script type="text/javascript">
        $(function () {
            var table = $('.data-table').DataTable({
                ordering: false,
                processing: true,
                language: {
                    processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> '
                },
                serverSide: true,
                ajax: "{{ route('logbook.all') }}",
                columns: [
                    {data: 'call', name: 'call'},
                    {data: 'rst_received', name: 'rst_received'},
                    {data: 'rst_sent', name: 'rst_sent'},
                    {data: 'band_tx', name: 'band_tx'},
                    {data: 'dxcc_country', name: 'dxcc_country'},
                    {data: 'end_date', name: 'end_date',"searchable": false },
                    {data: 'end_time', name: 'end_time',"searchable": false },
                ]
            });
        });
    </script>
@stop
