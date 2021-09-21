<div class="box-body">
    <p>
    <div class='form-group{{ $errors->has("{$lang}.call") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[call]", trans('logbook::entry.form.call')) !!}
        {!! Form::text("call", $entry->call, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.name')]) !!}
        {!! $errors->first("{$lang}.call", '<span class="help-block">:message</span>') !!}
    </div>

    <div class='form-group{{ $errors->has("{$lang}.dxcc_country") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[dxcc_country]", trans('logbook::entry.form.dxcc_country')) !!}
        {!! Form::text("dxcc_country",$entry->dxcc_country, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.title')]) !!}
        {!! $errors->first("{$lang}.dxcc_country", '<span class="help-block">:message</span>') !!}
    </div>


    <div class='form-group{{ $errors->has("{$lang}.lng") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[lng]", 'Longitude') !!}
        {!! Form::text("lng",$entry->lng, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.title')]) !!}
        {!! $errors->first("{$lang}.lng", '<span class="help-block">:message</span>') !!}
    </div>

    <div class='form-group{{ $errors->has("{$lang}.lat") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[lat]", 'Latitude') !!}
        {!! Form::text("lat",$entry->lat, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.title')]) !!}
        {!! $errors->first("{$lang}.lat", '<span class="help-block">:message</span>') !!}
    </div>


    <div class='form-group{{ $errors->has("{$lang}.country_slug") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[country_slug]", trans('logbook::entry.form.country_slug')) !!}
        {!! Form::text("country_slug", $entry->country_slug, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.slug')]) !!}
        {!! $errors->first("{$lang}.country_slug", '<span class="help-block">:message</span>') !!}
    </div>

    <div class='form-group{{ $errors->has("{$lang}.mode") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[mode]", trans('logbook::entry.title.mode')) !!}
        {!! Form::text("mode", $entry->mode, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('logbook::entry.form.mode')]) !!}
        {!! $errors->first("{$lang}.mode", '<span class="help-block">:message</span>') !!}
    </div>

    <div class='form-group{{ $errors->has("{$lang}.band_rx") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[band]", trans('logbook::entry.title.band_rx')) !!}
        {!! Form::text("band_rx", $entry->band_rx, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('logbook::entry.form.band_rx')]) !!}
        {!! $errors->first("{$lang}.band_rx", '<span class="help-block">:message</span>') !!}
    </div>

    <div class='form-group{{ $errors->has("{$lang}.band_tx") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[band]", trans('logbook::entry.title.band_tx')) !!}
        {!! Form::text("band_tx", $entry->band_tx, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('logbook::entry.form.band_tx')]) !!}
        {!! $errors->first("{$lang}.band_tx", '<span class="help-block">:message</span>') !!}
    </div>
    <div class='form-group{{ $errors->has("{$lang}.rst_received") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[rst_received]", trans('logbook::entry.title.rst_received')) !!}
        {!! Form::text("rst_received", $entry->rst_received, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('logbook::entry.form.rst_received')]) !!}
        {!! $errors->first("{$lang}.rst_received", '<span class="help-block">:message</span>') !!}
    </div>

    <div class='form-group{{ $errors->has("{$lang}.rst_sent") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[rst+sent]", trans('logbook::entry.title.rst_sent')) !!}
        {!! Form::text("rst_sent", $entry->rst_sent, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('logbook::entry.form.rst_sent')]) !!}
        {!! $errors->first("{$lang}.rst_sent", '<span class="help-block">:message</span>') !!}
    </div>

    <div class='form-group{{ $errors->has("{$lang}.payload") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[payload]", trans('logbook::entry.title.payload')) !!}
        {!! Form::text("payload", $entry->payload, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('logbook::entry.form.payload')]) !!}
        {!! $errors->first("{$lang}.payload", '<span class="help-block">:message</span>') !!}
    </div>
    </p>
</div>
