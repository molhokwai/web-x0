// init
molhokwai.ajax.app.dynamic.globals.command_element_id='command_json';

//<!-- 	process_functions
var on_submit=function(){
    /*  ---------------------------------------------------------------------------------------------------------
    //-- iframe
    var iframe=document.getElementById('iframe');
    iframe.src=document.getElementById('url').value;
    //document.getElementById('iframe').document.write(iframe.document.body.innerHTML.replace('pre>', 'code>')>0);

        ---------------------------------------------------------------------------------------------------------*/
    $('#frame').html('...');
    
    //-- json get
    $.getJSON(
        $('#url').val(),
        {
            'command_json' : molhokwai.ajax.app.dynamic.command.get(null, 'server')
        },
        function(json){
            try{
                $('#frame').html(
                    'json.message : <br>&nbsp;&nbsp;'+json.message
                    + '<br>json.result : <br>&nbsp;&nbsp;'+json.result
                    );
            }
            catch(e){ alert(e.toString()); }
        }
    );

    return false;
}

var set_crud=function(crud){
    var lines=$('#JSON_TEST_DATA_'+crud).val().replace('\'','"').split('\n');
    var comm_lines='';
    for(var i=0; i<lines.length; i++){
      if (i>0) comm_lines+='\n';
      comm_lines+=molhokwai.ajax.app.dynamic.format.command.line(lines[i]);
    }
    $('#command_json').val(comm_lines);
};
// 	end #process_functions -->

$(document).ready(function(){
    $('#url').val(window.location.protocol+'://'+window.location.host+'/process?module=dynamic_ajax_app&output=json');
    if ($('#data_admin_link').length>0){
        $('#data_admin_link')[0].href = window.location.host.indexOf('localhost')==0 ? '/_ah/admin/datastore' : 'http://appengine.google.com';
    }
});

