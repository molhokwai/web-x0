/*      ---------------------------------------------
        requires:
          jquery.js
          molhokwai.common.js
          molhokwai.ajax.app.js
        ---------------------------------------------*/
molhokwai.ajax.app.dynamic.ui = {
    form : {
        generate : {
            /* 
              Generates command from fieldset, div, form... with expected fields & format:
                <h3>[crud] [entity]</h3>
                <[fielsdet, div, form...] id=[fieldset_id]>
                  <label>[field]</label><[input, textarea, select] value=[value]/>
                  ...
                  <label>[field]</label><[input, textarea, select] value=[value]/>
                </[fielsdet, div, form...]>
            */
            command :
              function(fieldset_id){
                  var crud_entity=$('#'+fieldset_id+' div h3').html().split(' ');
                  var command_text=crud_entity[0].toLowerCase()+' '+crud_entity[1];
                  command_text+='\n';
                  
                  $('#'+fieldset_id+' div').each(function(){
                      $(this).find('label').each(function(){
                          var f_name=$(this).html();
                          if (f_name!='' && f_name!='where' && f_name!='&nbsp;'){
                              var f_value='';
                              
                              $(this).parent().find(':text').each(function(){
                                  f_value=$(this).val();
                              });
                              $(this).parent().find('textarea').each(function(){
                                  f_value=$(this).val();
                              });
                              $(this).parent().find('select').each(function(){
                                  f_value=$(this).val();
                              });
                              
                              try{
                                  if (parseFloat(f_value)==f_value){
                                      f_value=parseFloat(f_value);
                                  }
                              }
                              catch(e){
                              }
                              
                              var f_quot=molhokwai.ajax.app.dynamic.generate.field.get_type_quote_list(f_value)[1];
                              command_text+=f_name+'='+f_quot+f_value+f_quot+',';
                          }
                      });
                  });
                  command_text=command_text.substring(0,command_text.length-1);
                  
                  var where='';
                  $('#'+fieldset_id+' div').each(function(){
                      $(this).find('label').each(function(){
                          var f_name=$(this).html();
                          if (f_name=='where'){
                            $(this).parent().find('textarea').each(function(){
                                where+=$(this).val();
                            });
                          }
                      });
                  });
                  
                  if (where!=''){
                      command_text+='\n';
                      command_text+=where;
                  }
                  
                  return command_text
              },
              
            /* 
              From command, generates fieldset, div, form... with fields & format:
                <h3>[crud] [entity]</h3>
                <[fielsdet, div, form...] id=[fieldset_id]>
                  <label>[field]</label><[input, textarea, select] value=[value]/>
                  ...
                  <label>[field]</label><[input, textarea, select] value=[value]/>
                </[fielsdet, div, form...]>
            */
            html : 
              function(entity_name,crud,fields,conditions_lines,fieldset_id){
                  try {
                      $('#'+fieldset_id).html(' ');
                      
                      crud=crud.toUpperCase();
                      if (typeof(fields)=='String'){
                          fields=eval(fields);
                      }
                      if (typeof(conditions_lines)=='String'){
                          conditions_lines=eval(conditions_lines);
                      }

                      $('#'+fieldset_id).attr('name', entity_name);

                      var e_div=document.createElement('div');
                      var e_h3=document.createElement('h3');
                      $(e_h3).html(crud+' '+entity_name);
                      $(e_div).append(e_h3)
                      $('#'+fieldset_id).append(e_div);
                      
                      for (var i=0; i<fields.length;i++)
                      {
                          var field=fields[i];
                          if (typeof(field)=='String'){
                              field=eval('('+field+')');
                          }
                          var div=document.createElement('div');
                          var label=document.createElement('label');
                          $(label).attr({ 'for': field.name });
                          $(label).html(field.name);

                          var input=document.createElement('input');
                          $(input).attr({ 'type': field._type });
                          $(input).attr({ 'name': field.name });
                          $(input).val(field.value);

                          $(div).append(label);
                          $(div).append(input);
                          $('#'+fieldset_id).append(div);
                      }
                    
                      if (crud.toUpperCase()!='CREATE'){
                          var w_div=document.createElement('div');
                          var w_label=document.createElement('label');
                          $(w_label).html('where');

                          var w_textarea=document.createElement('textarea');
                          $(w_textarea).val(conditions_lines.join('\n'));
                          
                          $(w_div).append(w_label);
                          $(w_div).append(w_textarea);
                          $('#'+fieldset_id).append(w_div);
                      }

                      var s_div=document.createElement('div');
                      var s_label=document.createElement('label');
                      $(s_label).html('&nbsp;');

                      var s_input=document.createElement('input');
                      $(s_input).attr({ 'type':'button', 'class':'submit' , 'onclick':'on_fields_submit()' });
                      $(s_input).val('submit');

                      $(s_div).append(s_label);
                      $(s_div).append(s_input);
                      $('#'+fieldset_id).append(s_div);
                  }
                  catch(e){
                      $('#'+fieldset_id).append('<br/ >'+e.message);
                  }
              },
            
            list : {
                html : 
                  function(entity_name,json,fieldset_id){
                      this.append_tr=function(tr,link_path,entity,cruds){
                          for(var i=0;i<cruds.length;i++){
                            var td=document.createElement('td');
                            var a=document.createElement('a');
                            
                            a.href=link_path.replace('[crud]',cruds[i]);
                            a.innerHTML=cruds[i];
                            
                            $(td).append(a);
                            $(tr).append(td);
                          }
                      };
                      
                      var link_path='/crud/[entity]/[crud]';
                      try{
                          $('#'+fieldset_id).html('');
                          
                          var json_array=json.result;
                          
                          var table=document.createElement('table');
                          for(var i=0;i<json_array.length;i++){
                              var entity=eval("("+json_array[i]+")")._entity;
                              
                              /* tr th */
                              if (i==0){
                                  var tr=document.createElement('tr');
                                  for(k in entity){
                                      var th=document.createElement('th');
                                      th.innerHTML=k;
                                      $(tr).append(th);
                                  }
                                  $(table).append(tr);
                              }
                              
                              var tr=document.createElement('tr');
                              for(k in entity){
                                  var td=document.createElement('td');
                                  td.innerHTML=entity[k];
                                  $(tr).append(td);
                              }
                              
                              /* trs' crud links */
                              this.append_tr(tr,link_path.replace('[entity]',entity_name),entity,['read','update','delete']);
                              
                              $(table).append(tr);
                          }
                          
                          $('#'+fieldset_id).append(table);
                      }
                      catch(e){
                          $('#command_form')[0].innerHTML+=e.message;
                      }
                  }
            }
        }
    },
    
    pages : {
        create : 
          /*  
              Params
                  q_g_params : query generation parameters
                  l_on_s_callbacks  : last on submit callbacks
          */
          function(q_g_params,command_f_id,output_f_id,l_on_s_callbacks){
              var entity_name=q_g_params['entity_name'],crud=q_g_params['crud'];
              var fields=q_g_params['fields'],conditions_lines=q_g_params['conditions_lines'];
              
              var comm_json='';
              var cruds=molhokwai.ajax.app.dynamic.globals.cruds;
              for(var i=0;i<cruds.length;i++){
                  comm_json=  'create Pages'
                        +'\n'+'page_entity='+entity_name+',crud='+cruds[i];
                  // > output
                  if (output_f_id){
                      $('#'+output_f_id)[0].innerHTML+='<br/ >>create '+entity_name+' '+cruds[i]+' page...';
                      $('#'+output_f_id)[0].innerHTML+='<br/ ><code>'+comm_json.replace('\n','<br/ >')+'</code>';
                  }

                  /* exec */
                  $('#'+command_f_id).val(comm_json);
                  on_submit(l_on_s_callbacks);
              }
          },
          
        read : 
          /*  
              Params
                  q_g_params : query generation parameters
                  l_on_s_callbacks  : last on submit callbacks
          */
          function(q_g_params,command_f_id,output_f_id,l_on_s_callbacks){
              var entity_name=q_g_params['entity_name'],crud=q_g_params['crud'];
              var fields=q_g_params['fields'],conditions_lines=q_g_params['conditions_lines'];
              
              comm_json=  'read Pages'
                    +'\n'+'page_entity eq "'+entity_name+'"';

              // > output
              if (output_f_id){
                  $('#'+output_f_id)[0].innerHTML+='<br/ >>read '+entity_name+' pages...';
                  $('#'+output_f_id)[0].innerHTML+='<br/ ><code>'+comm_json.replace('\n','<br/ >')+'</code>';
              }

              /* exec */
              $('#'+command_f_id).val(comm_json);
              on_submit(l_on_s_callbacks);
          }
    },
    
    page : {
        app_name    : null,
        entity_name : null,
        purpose     : null,
        init : 
          function(app_name,entity_name,purpose){
            molhokwai.ajax.app.dynamic.ui.page.app_name=app_name;
            molhokwai.ajax.app.dynamic.ui.page.entity_name=entity_name;
            molhokwai.ajax.app.dynamic.ui.page.purpose=purpose;
          },

        entity : {
            fields : null
        }
    }
    
};

