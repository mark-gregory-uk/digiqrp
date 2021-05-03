<div class="box-body">
    <p>
    <div class="table-responsive">
        <table class="data-table table table-bordered table-hover">
            <thead>
            <tr>
                <th>Name</th>
                <th>Day</th>
                <th>Night</th>
            </tr>
            </thead>
            <tbody>
            <?php if (isset($reports)) { ?>
            <?php foreach ($reports as $report) { ?>
            <tr>
                <td>{{ $report->name }}</td>
                <td>{{ $report->day_condx }}</td>
                <td>{{ $report->night_condx }}</td>
            </tr>
            <?php } ?>
            <?php } ?>
            </tbody>
        </table>
    </div>
    </p>
    <p></p>
</div>
