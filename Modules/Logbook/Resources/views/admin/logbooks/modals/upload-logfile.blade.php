{{-- @if($currentUser->hasAccess('company.companies.upload')) --}}
    <div class="modal fade" id="upload-logfile">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Upload Log File</h4>
                </div>
                <form action="{{ route('logbook.upload',['owner'=>Auth::id(),'logbook'=>$logbook->id]) }}" method="post" enctype="multipart/form-data">
                <div class="modal-body">
                    @csrf

                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group {{ $errors->first('file', 'has-error' ) }}">
                                <div class="custom-file">
                                    <input type="file" name="file" class="custom-file-input" id="chooseFile">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="row">
                        <div class="col-xs-12">
                            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">
                                {{ 'Cancel' }}
                            </button>
                            <input class="btn btn-primary" type="submit" value="Upload" />
                        </div>
                    </div>
                </div>
                </form>
            </div>
        </div>
    </div>

<script>
    $(document).ready(function(){
        $('#upload-logfile').modal('show');
    });
</script>
