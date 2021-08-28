<div class="box-body">
    <p>
    <div class='form-group{{ $errors->has("{$lang}.call") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[call]", trans('logbook::entry.form.call')) !!}
        {!! Form::text("call", $entry->call, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.name')]) !!}
        {!! $errors->first("{$lang}.call", '<span class="help-block">:message</span>') !!}
    </div>


    <div class='form-group{{ $errors->has("{$lang}.dxcc_country") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[dxcc_country]", trans('logbook::entry.form.dxcc_country')) !!}
        {!! Form::text("{$lang}[dxcc_country]",$entry->dxcc_country, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.title')]) !!}
        {!! $errors->first("{$lang}.dxcc_country", '<span class="help-block">:message</span>') !!}
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
    <div class='form-group{{ $errors->has("{$lang}.payload") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[payload]", trans('logbook::entry.title.payload')) !!}
        {!! Form::text("mode", $entry->payload, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('logbook::entry.form.payload')]) !!}
        {!! $errors->first("{$lang}.payload", '<span class="help-block">:message</span>') !!}
    </div>
    </p>
</div>
