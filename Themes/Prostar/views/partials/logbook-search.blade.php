
<script>

    $('#call').on('input', function() {
        var input=$(this);
        var is_name= $('#call').val();
        if(is_name){ $('#call').removeClass("invalid").addClass("valid");}
        else{ $('#call').removeClass("valid").addClass("invalid");}
    });

    $('#btn-save').submit(function(e) {
        e.preventDefault();
        $('#logEntryModal').modal('hide');
        return false;
    });

    function getCall(){
        let callsign = $('#searchCall').val();
        $('#searchCall').removeClass("invalid").addClass("valid")
        if (callsign.length > 0){
            $.ajax({
                type:'POST',
                url:' api/v1/search',
                data:{
                    "_token": "{{ csrf_token() }}",
                    call:callsign
                },
                success: function(result) {
                    jQuery('#logEntryModal').modal('show');
                    jQuery('#band').text(result.band);
                    jQuery('#date').text(result.date);
                    jQuery('#stationCall').text(result.callsign);
                    jQuery('#count').text(result.count);
                    $('#searchCall').removeClass("valid").removeClass("invalid").val('');
                },
                error: function(data){
                    var errors = data.responseJSON;
                    jQuery('#err_message').text(errors.errors);
                    jQuery('#logEntryErrorModal').modal('show');
                    $('#searchCall').removeClass("valid").removeClass("invalid").val('');
                }
            });
        } else {
            $('#searchCall').removeClass("valid").addClass("invalid")
        }
    }
    $(document).on('click', '#search', function(event) {
        event.preventDefault();
        /* Act on the event */
        getCall();
    });

    $(document).ready(function(){
        $('#call').keyup(function(){
            $(this).val($(this).val().toUpperCase());
        });
    });

</script>

<style>
    .error{
        display: none;
        margin-left: 10px;
    }

    .error_show{
        color: red;
        margin-left: 10px;
    }
    input.invalid, textarea.invalid{
        border: 2px solid red;
    }

    input.valid, textarea.valid{
        border: 2px solid green;
    }
</style>

<div class="well">
    <h4 class="page-header">Logbook Search</h4>
    <p style="font-size: smaller;">Enter a callsign.</p>
    <form method="post" action="#" enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="form-group row">
            <div class="col-sm-2">
                <input style="height:auto; width: auto;margin-left: 19px;" id="searchCall" name="searchCall" maxlength="15" type="text" class="form-control" placeholder="Enter callsign">
                <span class="error">A callsign is required</span>
            </div>
        </div>

        <div style="float: right;margin-right: -14px;" class="col-sm-4">
            <button id="search" type="button" class="btn btn-primary">Find</button>
        </div>
    </form>

    <div style="width: 240px;" class="modal fade" id="logEntryModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Logbook Entry</h3>
                </div>
                <div class="modal-body">

                    <p>The following information has been recovered for this station.</p>
                    <div class="form-group">
                        <span>Callsign: </span><span id="stationCall"></span><br>
                        <span>Band:  </span><span id="band"></span><br>
                        <span>Worked:  </span><span id="date"></span><br>
                        <span>Count:  </span><span id="count"></span><br>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" type="button" class="btn btn-primary" id="btn-close" value="close">Close</button>
                </div>
            </div>
        </div>
    </div>


    <div style="width: 240px;" class="modal fade" id="logEntryErrorModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Logbook Entry</h3>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger" name="err_message" id="err_message"></div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" type="button" class="btn btn-primary" id="btn-close" value="close">Close</button>
                </div>
            </div>
        </div>
    </div>

</div>
