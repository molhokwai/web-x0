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
            'command_json' : molhokwai.ajax.app.dynamic.command.get(null, 'server', build_form)
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

var on_fields_submit=function(){
    $('#command_json').val(molhokwai.ajax.app.dynamic.ui.form.generate.command('command_fieldset'));
    return false;
}

var set_crud=function(crud){
    var lines=$('#JSON_TEST_DATA_'+crud).val().replace('\'','"').split('\n');
    var comm_lines='';
    for(var i=0; i<lines.length; i++){
      if (i>0) comm_lines+='\n';
      comm_lines+=molhokwai.ajax.app.dynamic.
                      format.command.line(lines[i]);
    }
    $('#command_json').val(comm_lines);
};

var build_form=function(entity_name,crud,fields,conditions_lines){
    molhokwai.ajax.app.dynamic.ui.form.generate.html(entity_name,crud,fields,conditions_lines,'command_form');
}
// 	end #process_functions -->

$(document).ready(function(){
    var sections=window.location.href.split('/');
    var protocol_host=sections[0]+'//'+sections[1]+sections[2];
    $('#url').val(protocol_host+'/process?module=dynamic_ajax_app&output=json');
});

