
<script>
    $('#btn-save').submit(function(e) {
        e.preventDefault();
        $('#formModal').modal('hide');
        return false;
    });

    function getMessage(){
        let callsign = $('#callsign').val();

        $.ajax({
            type:'POST',
            url:'/callbook/lookup',
            data:{
                "_token": "{{ csrf_token() }}",
                callSign:callsign
            },
            success: function(result) {
                console.log(result);
                jQuery('#formModal').modal('show');
                jQuery('#country').text(result.country);
                jQuery('#call').text(result.call);
                jQuery('#continent').text(result.continent);
            }
        });
    }
    $(document).on('click', '#getCall', function(event) {
        event.preventDefault();
        /* Act on the event */
        getMessage();
    });

</script>

<div class="well">
    <h3 class="page-header">Call Lookup </h3>
    <form method="post" action="#" enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="form-group row">
            <div class="col-sm-2">
                <input style="width: auto;margin-left: 13px;" id="callsign" name="callsign" maxlength="15" type="text" class="form-control" placeholder="Call Sign">
            </div>
        </div>

        <div style="float: right;margin-right: -14px;" class="col-sm-4">
            <button id="getCall" type="button" class="btn btn-primary">Search</button>
        </div>



    </form>

    <div style="width: 240px;" class="modal fade" id="formModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="formModalLabel">Callsign Details</h4>
                </div>
                <div class="modal-body">
                        <div class="form-group">
                           <span id="call"></span>
                           <span id="country"></span>
                            <span id="continent"></span>
                        </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" type="button" class="btn btn-primary" id="btn-save" value="close">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>