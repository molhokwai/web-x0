/* WORKING OBSOLETE CODE */
try{
  //<!-- 	utility_functions
  var get_query_string_for_acd=function(){
    // get all the inputs, selects, textareas into arrays.
    var $inputs = $('#app_form :input');
    var $selects = $('#app_form select');
    var $texteareas = $('#app_form textearea');

    // get an associative array of the escaped values.
    try{
	    var values = {};
	    $inputs.each(function() {
		    values[this.name] = escape($(this).val());
	    });
	    $selects.each(function() {
		    values[this.name] = escape($(this).val());
	    });
	    $texteareas.each(function() {
		    values[this.name] = escape($(this).val());
	    });
    }
    catch(e){
	    alert(e.description);
    }

    var acd_query_string='';
    var i=0;
    for(k in values){ 
	    if (i>0) { acd_query_string+='&amp;'; }
	    else { i++; }
	    acd_query_string+=k+'='+values[k];
    }

    return acd_query_string;
  };
  var inc=0;
  var delayed_result=function(){
    try{
	    document.getElementById("app_user-message").innerHTML+=ACD.responseText;
	    if (ACD.error && ACD.error!=''){
		    document.getElementById("app_user-message").innerHTML='An error occured. Retry, or contact the administrator (admin@molhokwai.net).';
	    }

    }
    catch(e){
	    if (inc<10){
		    setTimeout('delayed_result();',1000);
		    document.getElementById("app_user-message").innerHTML+='.';
		    inc++;
	    }
	    else{
		    document.getElementById("app_user-message").innerHTML='...this is taking too long. Retry, or contact the administrator (admin@molhokwai.net).';
	    }

    }
  };
  //	end #utility_functions -->
        var get_json_command=function(){
            var lines=document.getElementById('command_json').value.split('\n');
            for(var i=0; i<lines.length;i++){
                lines[i]=lines[i].replace('\n', '');
                lines[i]=lines[i].replace('\t', '');
                lines[i]=lines[i].replace('        ', '');
            }
            return lines.join('');
        };
  //<!-- 	process_functions
  var on_submit=function(){
        /*  ---------------------------------------------------------------------------------------------------------
            //-- iframe
      var iframe=document.getElementById('iframe');
        iframe.src=document.getElementById('url').value;
        //document.getElementById('iframe').document.write(iframe.document.body.innerHTML.replace('pre>', 'code>')>0);

            ---------------------------------------------------------------------------------------------------------*/
            //-- ajaax get
      $.getJSON(
          document.getElementById('url').value,
          {
              'command_json' : get_json_command()
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

  var ajax_submit=function(){
    var queryString = $('#app_form').formSerialize();
    var url='http://www.ajax-cross-domain.com/cgi-bin/ACD/ACD.js?uri=';
    var post_uri='http://creator.zoho.com/api/json/molhokwai.zoho/target/add/';
    var uri='('+post_uri+')&amp;method=post&amp;postdata=('+get_query_string_for_acd()+')';

    document.getElementById("description").innerHTML=url+uri;
    document.getElementById('cross-domain-ajax').setAttribute("src", url+uri);
    document.getElementById("app_user-message").innerHTML='processing, please wait... this might take a few seconds';

    delayed_result();
  };
  //	end #process_functions -->
}
catch(e){
  alert(e.description);
}

var add_param=function(options){
    if (options) {
        if (options['_type']){
            if (options['_type']=='multiline'){
                var p=document.createElement('p');
                var textarea=document.createElement('textarea');
                var params_div=document.getElementById('params_div');
                
                textarea.rows=20;
                p.appendChild(textarea);
                app_form.appendChild(p);
            }
        }
    }
    else {
    }
}
var set_crud=function(crud){
    $('#command_json').val($('#JSON_TEST_DATA_'+crud).val().replace('\'','"'));
};

