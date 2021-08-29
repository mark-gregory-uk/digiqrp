<div class="box-body">
    <div class='form-group{{ $errors->has("{$lang}.name") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[name]", trans('logbook::logbooks.form.name')) !!}
        <p>{!! $logbook->name !!}</p>
    </div>

    <div class='form-group{{ $errors->has("{$lang}.title") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[title]", trans('logbook::logbooks.form.title')) !!}
        <p>{!! $logbook->title  !!}</p>
    </div>

    <div class='form-group{{ $errors->has("{$lang}.slug") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[slug]", trans('logbook::logbooks.form.slug')) !!}
        <p>{!! $logbook->slug!!}</p>
    </div>
</div>
