// init
molhokwai.ajax.app.dynamic.globals.command_element_id='command_json';

//<!-- 	process_functions
var on_submit=function(callbacks){
    /*  ---------------------------------------------------------------------------------------------------------
    //-- iframe
    var iframe=document.getElementById('iframe');
    iframe.src=document.getElementById('url').value;
    //document.getElementById('iframe').document.write(iframe.document.body.innerHTML.replace('pre>', 'code>')>0);

        ---------------------------------------------------------------------------------------------------------*/
    $('#frame').html('...');
    
    var form_callback=null;
    var result_callback=null;
    if (callbacks && 'form' in callbacks){
        form_callback=callbacks['form'];
    }
    if (callbacks && 'result' in callbacks){
        result_callback=callbacks['result'];
    }
    else {
        result_callback=function(json)
        {
            try{
                $('#frame').html(
                    'json.message : <br>&nbsp;&nbsp;'+json.message
                    + '<br>json.result : <br>&nbsp;&nbsp;'+json.result
                    );
            }
            catch(e){ 
                if (e.message.indexOf('eval("(" + json.result[0] + ")")')>=0){
                    $('#command_fieldset').html('no data created yet...');
                }
                else{
                    $('#command_fieldset').append(e.message);
                }
            }
        };
    }
    
    //-- json get
    $.getJSON(
        $('#url').val(),
        {
            'command_json' : molhokwai.ajax.app.dynamic.command.get(null, 'server', form_callback)
        },
        result_callback
    );

    return false;
}

var create_pages=function(entity_name,crud,fields,conditions_lines){
    try {
        // > output
        $('#command_form')[0].innerHTML='>created '+entity_name;

        molhokwai.ajax.app.dynamic.ui.pages.create(
            {
              'entity_name' : entity_name,
              'crud'        : crud,
              'fields'      : fields,
              'conditions_lines'  : conditions_lines
            },
            'command_json',
            'command_form'
        );
        molhokwai.ajax.app.dynamic.ui.pages.read(
            {
              'entity_name' : entity_name,
              'crud'        : crud,
              'fields'      : fields,
              'conditions_lines'  : conditions_lines
            },
            'command_json',
            'command_form',
            {
              'result' : 
                /* generate crud page links */
                function(json){
                    this.tr=function(link_path,entity,i,index){
                        var tr=document.createElement('tr');
                        var td=document.createElement('td');
                        var a=document.createElement('a');
                        td.innerHTML='';
                        
                        var td_link_path=link_path;
                        if (i==0 && !index){
                            td_link_path=link_path.replace('/[crud]','');
                        }
                        var td_link_text='';
                        
                        for(k in entity){
                          td_link_path=td_link_path.replace('['+k+']',entity[k]);
                          td_link_text+=entity[k]+' ';
                        }
                        if (i==0 && !index){
                            td_link_text='index';
                        }
                        
                        a.href=td_link_path;
                        a.innerHTML=td_link_text;
                        $(td).append(a);
                        $(tr).append(td);
                        
                        return tr
                    };
                    
                    var link_path='/crud/[page_entity]/[crud]';
                    try{
                        $('#command_fieldset').html('');
                        
                        var json_array=json.result;
                        
                        var table=document.createElement('table');
                        for(var i=0;i<json_array.length;i++){
                            var entity=eval("("+json_array[i]+")")._entity;
                            
                            /* tr th */
                            if (i==0){
                                var tr=document.createElement('tr');
                                var th=document.createElement('th');
                                th.innerHTML='';
                                
                                for(k in entity){
                                  if (k=='page_entity'){
                                      th.innerHTML+=entity[k]+' ';
                                  }
                                  else{
                                      th.innerHTML+=k+' ';
                                  }
                                }
                                $(tr).append(th);
                                $(table).append(tr);
                            
                                /* tr 'index' */
                                var tr=this.tr(link_path,entity,i);
                                $(table).append(tr);
                            }
                            
                            /* trs' tds */
                            var tr=this.tr(link_path,entity,i,true);
                            $(table).append(tr);
                        }
                        
                        $('#command_fieldset').append(table);
                    }
                    catch(e){
                        $('#command_form')[0].innerHTML+=e.message;
                    }
                }
            }
        );
    }
    catch(e){
        $('#command_form')[0].innerHTML+='<br/ >'+e.message;
    }
};
// 	end #process_functions -->


$(document).ready(function(){
    var sections=window.location.href.split('/');
    var protocol_host=sections[0]+'//'+sections[1]+sections[2];
    $('#url').val(protocol_host+'/process?module=dynamic_ajax_app&output=json');
    $('#command_json').focus();
});

