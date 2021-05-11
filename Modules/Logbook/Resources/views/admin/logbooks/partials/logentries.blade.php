<div class="table-responsive">
    <table class="data-table table table-bordered table-hover">
        <thead>
        <tr>
            <th>Call</th>
            <th>Mode</th></yh>
            <th>QSO Start</th>
            <th>QSO End</th>
            <th>Country</th>
            <th>Slug</th>
            <th>Created</th>
            <th data-sortable="false">{{ trans('core::core.table.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <?php if (isset($logbook->entries)) { ?>
        <?php foreach ($logbook->entries as $entry) { ?>
        <tr>
            <td>
                <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}">
                    {{ $entry->call }}
                </a>
            </td>
            <td>
                <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}">
                    {{ $entry->mode }}
                </a>
            </td>
            <td>
                <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}">
                    {{ $entry->qso_start }}
                </a>
            </td>
            <td>
                <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}">
                    {{ $entry->qso_end }}
                </a>
            </td>
            <td>
                <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}">
                    {{ $entry->dxcc_country }}
                </a>
            </td>
            <td>
                <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}">
                    {{ $entry->country_slug }}
                </a>
            </td>
            <td>
                <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}">
                    {{ $entry->created_at }}
                </a>
            </td>
            <td>
                <div class="btn-group">
                    <a href="{{ route('admin.logbook.entry.edit', [$entry->id]) }}" class="btn btn-default btn-flat"><i class="fa fa-pencil"></i></a>
                    <button class="btn btn-danger btn-flat" data-toggle="modal" data-target="#modal-delete-confirmation" data-action-target="{{ route('admin.logbook.logbook.destroy', [$entry->id]) }}"><i class="fa fa-trash"></i></button>
                </div>
            </td>
        </tr>
        <?php } ?>
        <?php } ?>
        </tbody>
    </table>
    <!-- /.box-body -->
</div>
