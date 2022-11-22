
<script>

    $('#callsign').on('input', function() {
        var input=$(this);
        var is_name= $('#callsign').val();
        if(is_name){ $('#callsign').removeClass("invalid").addClass("valid");}
        else{ $('#callsign').removeClass("valid").addClass("invalid");}
    });

    $('#btn-save').submit(function(e) {
        e.preventDefault();
        $('#formModal').modal('hide');
        return false;
    });

    function getMessage(){
        let callsign = $('#callsign').val();
        $('#callsign').removeClass("invalid").addClass("valid")
        if (callsign.length > 0){
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
                    jQuery('#timezone').text(result.timezone);
                    $('#callsign').removeClass("valid").removeClass("invalid").val('');
                }
            });
        } else {
            $('#callsign').removeClass("valid").addClass("invalid")
        }
    }
    $(document).on('click', '#getCall', function(event) {
        event.preventDefault();
        /* Act on the event */
        getMessage();
    });

    $(document).ready(function(){
        $('#callsign').keyup(function(){
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
    <h4 class="page-header">Country Lookup </h4>
    <p style="font-size: smaller;">Enter a prefix or a full callsign.</p>
    <form method="post" action="#" enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="form-group row">
            <div class="col-sm-2">
                <input style="height:auto; width: auto;margin-left: 19px;" id="callsign" name="callsign" maxlength="15" type="text" class="form-control" placeholder="Call Sign">
                <span class="error">A valid callsign is required</span>
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
                    <h3>CallSign Country Data</h3>
                </div>
                <div class="modal-body">

                    <p>The following information has been recovered for this station.</p>
                        <div class="form-group">
                           <span>Callsign: </span><span id="call"></span><br>
                           <span>Country:  </span><span id="country"></span><br>
                           <span>Continent: </span><span id="continent"></span><br>
                           <span>GMT Offset: </span><span id="timezone"></span><br>
                        </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" type="button" class="btn btn-primary" id="btn-save" value="close">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>