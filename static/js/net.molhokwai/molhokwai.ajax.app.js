/*      ---------------------------------------------
        requires:
          molhokwai.common.js
          jquery.js
        ---------------------------------------------*/
molhokwai['ajax'] = {
  app : {
    dynamic : {
      /* globals */
      globals : {
        /* for reference : 
          ops_and_cond_strings : [' eq ',  ' or ',         ' and ',        ' neq ',    ' gt ', ' lt ',     ' goet ', ' loet ', 
                                    ' == ', ' || ', ' | ',  ' && ', ' & ',  ' != ',     ' > ',  ' < ',      ' >= ', ' <= '],
        */
        cruds : ['create', 'read', 'update', 'delete'],
        
        comp_ops_strings : [' eq ',    ' neq ',    ' gt ', ' lt ',     ' goet ', ' loet ', 
                              ' == ',    ' != ',     ' > ',  ' < ',      ' >= ', ' <= '],
        comp_ops_tokens : {'==' : 'eq',    '!=' : 'neq',    '>' : 'gt', '<' : 'lt',  '>=' : 'goet', '<=' : 'loet' },
        ops_conversions : {'eq' : '==',    'neq' : '!=',    'gt' : '>', 'lt' : '<',  'goet' : '>=', 'loet' : '<='},
        cond_ops_strings : [' and ', ' or ', ' && ', ' || ', '&', '|'],

        command_element_id : null
      },
      
      convert : {
        to_string : {
          field : function(field_o, op){
            var ops_conversions=molhokwai.ajax.app.dynamic.globals.ops_conversions;
            for(k in ops_conversions){
              if(op==k) op=ops_conversions[k];
            }
            if (op==null) op='=';
            var f_quot='';
            if (field_o.type!='Number') f_quot='"';
            return field_o.name + op + f_quot+field_o.value+f_quot;
          }
        }
      },

      format : {
        command : {
          operator : {
            for_server : function(op){
              var comp_ops_tokens=molhokwai.ajax.app.dynamic.globals.comp_ops_tokens;
              for(k in comp_ops_tokens){
                if(op==k) op=comp_ops_tokens[k];
              }
              return op
            }
          },
        
          line : function(line){
            var is_condition=false;

            line=$.trim(line);
            
            var crud=line.split(' ')[0];
            if (molhokwai.ajax.app.dynamic.globals.cruds.join(',').indexOf(crud)>=0){
              /* entity crud */
              var entity_name=line.split(' ')[1];
              return crud + ' ' + entity_name;
            }
            else {
              /* conditions */
              var conditions=molhokwai.ajax.app.dynamic.command.conditions.get(line);
              is_condition=conditions.length>0;
              
              if (is_condition) {
                var cond_s='';
                for(var i=0; i<conditions.length; i++){
                  /* '{"name"  :   "'+f_name+'", "type"  :   "'+f_type+'", "value" :   '+f_quot+f_value+f_quot+', 
                        '"comp_operator" :   "'+op+'", "cond_operator" :   "'+cond_op+'" }' */
                  var cond_o=eval("("+conditions[i]+")");
                  var cond_op='';
                  try{ 
                      if (cond_o.cond_operator){
                        cond_op=' ' + cond_o.cond_operator + ' ';
                      }
                  }
                  catch(e){}
                  cond_s+=molhokwai.ajax.app.dynamic.convert.to_string.field(cond_o, cond_o.comp_operator) + cond_op;
                }
                return cond_s;
              }
              
              /* fields */
              if (!is_condition) {
                var fields=molhokwai.ajax.app.dynamic.command.fields.get(line);
                var field_s='';
                for(var i=0; i<fields.length; i++){
                  /* '{"name"  :   "'+f_name+'", "type"  :   "'+f_type+'", "value" :   '+f_quot+f_value+f_quot+'}' */
                  if (i>0) field_s+=',';

                  var field_o=eval("("+fields[i]+")");
                  var f_quot='';
                  if (field_o.type!='Number') f_quot='"';
                  
                  field_s+=molhokwai.ajax.app.dynamic.convert.to_string.field(field_o)
                }
                if (field_s!=''){
                  return field_s
                }
              }
            }
          }
        }
      },
      
      //<!-- 	field, condition generation
      generate : {
          /* generate condition */
          condition : function(cond_string, cond_op, dest) {
            var comp_ops_strings=molhokwai.ajax.app.dynamic.globals.comp_ops_strings;
            var comp_ops_tokens=molhokwai.ajax.app.dynamic.globals.comp_ops_tokens;
            var conditions=[];
            
            var op=null;
            for(var j=0; j<comp_ops_strings.length;j++) {
                var _op=comp_ops_strings[j];
                if (cond_string.indexOf(_op)>0
                    || ($.trim(_op) in comp_ops_tokens && cond_string.indexOf($.trim(_op))>0)) {
                    op=$.trim(_op);
                    break;
                }
            }
            if (op){
                var field=molhokwai.ajax.app.dynamic.generate.field._(cond_string,op);
                if (dest=='server'){
                  op=molhokwai.ajax.app.dynamic.format.command.operator.for_server(op);
                }
                
                if (cond_op){
                    return field.replace('}', ', "comp_operator" :   "'+op+'", "cond_operator" :   "'+cond_op+'" }');
                }
                else {
                    return field.replace('}', ', "comp_operator" :   "'+op+'"}');
                }
            }
            else {
                return null
            }
        },
        
        /* generate field */
        field : {
            /* returns [<type>, <quot>] */
            get_type_quote_list : function(f_value){
                var f_type=null;
                var f_quot='"';
                try{ 
                    if (typeof(f_value)=='number'){
                      f_type='Number';
                      f_quot='';
                    }
                    else {
                      f_type='String';
                      var f_c=f_value.substring(0,1)
                      var l_c=f_value.substring(f_value.length-1)
                      if ((f_c=='"' && l_c=='"') || (f_c=="'" && l_c=="'")){
                        f_quot='';
                      }
                    }
                }
                catch(e){
                    f_type='String';
                }
                
                return [f_type, f_quot]
            },
            
            _ : function(field_string, op) {
                if (op==null){ op='='; }
                
                var field_split=field_string.split(op);
                var f_name=$.trim(field_split[0]);
                var f_value=$.trim(field_split[1]);
                
                var f_t_q_l=molhokwai.ajax.app.dynamic.generate.field.get_type_quote_list(f_value);
                var f_type=f_t_q_l[0];
                var f_quot=f_t_q_l[1];

                return '{"name"  :   "'+f_name+'", "type"  :   "'+f_type+'", "value" :   '+f_quot+f_value+f_quot+'}'
            }
        }
        // 	end #field -->
      },
      // 	end #condition generation -->

      
      //<!-- 	command text parsing, command generation
      command : {
          /* build command json string */
          build : function(entity_name,crud,fields,conditions){
              var _command='{';
              _command+='"entities" :';
              _command+=' [';
              _command+='     {';
              _command+='         "type":"'+entity_name+'",';
              _command+='         "action":"'+crud.toLowerCase()+'",';
              _command+='         "fields": {';
              _command+='                     "'+crud.toLowerCase()+'":['+fields.join(',')+']';
              _command+='                 },';
              _command+='         "conditions":';
              _command+='             {';
              _command+='                 "main" :['+conditions['main'].join(',')+']';
              _command+='             }';
              _command+='     }';
              _command+=' ]';
              _command+='}';
              
              
              return _command
          },
          
          conditions : {
            get : function(line, dest){
                var cond_ops_strings=molhokwai.ajax.app.dynamic.globals.cond_ops_strings;
                var generate_condition=molhokwai.ajax.app.dynamic.generate.condition;
                
                var conditions=[];
                var conds_indexes=[];
                var ops_and_indexes={};
                var conds_strings={};
                for(var j=0; j<cond_ops_strings.length;j++) {
                    var op=cond_ops_strings[j];
                    var cond_ind=line.indexOf(op);
                    if (cond_ind>0) {
                        conds_indexes.push(cond_ind);
                        ops_and_indexes[cond_ind]=op;
                    }
                }
                
                if (conds_indexes.length==0){
                    var comp_ops_strings=molhokwai.ajax.app.dynamic.globals.comp_ops_strings;
                    for(var j=0; j<comp_ops_strings.length;j++) {
                        var op=comp_ops_strings[j];
                        if (line.indexOf(op)>0) {
                            var c=generate_condition(line, null, dest);
                            if (c){ conditions.push(c); }
                        }
                    }
                }
                else {
                    conds_indexes.sort();
                    var op='';
                    for(var j=0; j<conds_indexes.length;j++) {
                        op=ops_and_indexes[conds_indexes[j]];
                        if (j==0 || j<conds_indexes.length-1){
                            if (j==0) {
                                conditions.push(generate_condition(line.substring(0, conds_indexes[j]), $.trim(op), dest));
                            }
                            else {
                                conditions.push(generate_condition(line.substring(conds_indexes[j], conds_indexes[j+1]), $.trim(op), dest));
                            }
                        }
                    }
                    conditions.push(generate_condition(line.substring(conds_indexes[conds_indexes.length-1]+op.length), null, dest));
                }
                
                
                return conditions
            }
          },
          
          fields : {
            get : function(line){
                var fields=[];
                
                var generate_field=molhokwai.ajax.app.dynamic.generate.field._;

                var line_fields=line.split(',');
                for(var j=0;j<line_fields.length;j++) {
                    fields.push(generate_field(line_fields[j]));
                }
                
                return fields
            }
          },

          /* get json command */
          get : function(lines, dest, form_callback) {
              if (lines==null){
                lines=document.getElementById(molhokwai.ajax.app.dynamic.globals.command_element_id).value.split('\n');
              }
              var crud=null;
              var entity_name=null;
              var fields=[];
              var conditions={'main' : []};
              var conditions_lines=[];
              
              for(var i=0; i<lines.length;i++){
                  lines[i]=lines[i].replace('\n', '');
                  lines[i]=lines[i].replace('\t', '');
                  lines[i]=lines[i].replace('        ', '');
                  
                  if (i==0){
                      /* crud & entity name */
                      crud=lines[i].split(' ')[0];
                      entity_name=lines[i].split(' ')[1];
                  }
                  else {
                      var is_condition=false;

                      /* conditions */
                      var _conditions=molhokwai.ajax.app.dynamic.command.conditions.get(lines[i], dest);
                      is_condition=_conditions.length>0;
                      if (is_condition) {
                        conditions_lines.push(lines[i])
                        for(var j=0; j<_conditions.length; j++){
                          conditions['main'].push(_conditions[j]);
                        }
                      }
                      
                      /* fields */
                      if (!is_condition) {
                        var _fields=molhokwai.ajax.app.dynamic.command.fields.get(lines[i]);
                        for(var j=0; j<_fields.length; j++){
                          fields.push(_fields[j]);
                        }
                      }
                  }
              }
      
              if (crud=='delete' && fields.length==0) { fields.push('"*"'); }
              if (form_callback) { form_callback(entity_name,crud,fields,conditions_lines); }
              return molhokwai.ajax.app.dynamic.command.build(entity_name,crud,fields,conditions);
          }
      },
      //end #command text parsing, command generation -->
      
      ui : {
      }
    }
  }
};

