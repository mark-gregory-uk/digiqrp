<div class="box-body">
    <p>

    <div class='form-group{{ $errors->has("{$lang}.name") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[name]", trans('logbook::countries.form.name')) !!}
        {!! Form::text("name", $logbookCountry->name, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.name')]) !!}
        {!! $errors->first("{$lang}.name", '<span class="help-block">:message</span>') !!}
    </div>


    <div class='form-group{{ $errors->has("{$lang}.title") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[title]", trans('logbook::countries.form.code')) !!}
        {!! Form::text("{$lang}[title]",$logbookCountry->code, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.title')]) !!}
        {!! $errors->first("{$lang}.title", '<span class="help-block">:message</span>') !!}
    </div>


    <div class='form-group{{ $errors->has("{$lang}.slug") ? ' has-error' : '' }}'>
        {!! Form::label("{$lang}[slug]", trans('logbook::countries.form.slug')) !!}
        {!! Form::text("slug", $logbookCountry->slug, ['class' => 'form-control', 'data-slug' => 'source', 'placeholder' => trans('page::pages.slug')]) !!}
        {!! $errors->first("{$lang}.slug", '<span class="help-block">:message</span>') !!}
    </div>

    </p>
</div>
