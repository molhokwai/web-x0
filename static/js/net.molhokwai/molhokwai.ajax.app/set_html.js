madaa.options.html.set(
     '<h1>'+madaa.options.html.title+'</h1>'
    +'<form id="app_form" action="" method="post" onsubmit="on_submit(); return false;">'
    +'    <input type="hidden" name="url" size="20" id="url" value="'+madaa.options.api.url+'"/>'
    +'    <p>'+madaa.options.html.text+'</p>'
    +'    <p>'
    +'        <label for="command_json">'+madaa.options.html.labels.text_command+':</label>'
    +'        <textarea id="command_json" name="command_json" rows="30" class="font-size08em" style="width:65em;"></textarea>'
    +'    </p>'
    +'    <label for="rbl">'+madaa.options.html.labels.examples+'</label>'
    +'    <p id="rbl" class="margr8pc">'
    +'        <span>delete</span><input name="crud" type="radio" value="'+madaa.options.html.labels.read+'" onclick="set_crud(\''+madaa.options.html.labels.read.toUpperCase()+'\')"/>'
    +'        <span>update</span><input name="crud" type="radio" value="'+madaa.options.html.labels.update+'" onclick="set_crud(\''+madaa.options.html.labels.update.toUpperCase()+'\')"/>'
    +'        <span>read</span><input name="crud" type="radio" value="'+madaa.options.html.labels.read+'" onclick="set_crud(\''+madaa.options.html.labels.read.toUpperCase()+'\')"/>'
    +'        <span>create</span><input name="crud" type="radio" value="'+madaa.options.html.labels.create+'" onclick="set_crud(\''+madaa.options.html.labels.create.toUpperCase()+'\')"/>'
    +'    </p>'
    +'    <div class="clear"></div>'
    +'    <p><label for="submit">&nbsp;</label><input type="submit" class="right" value="'+madaa.options.html.labels.submit+'"/></p>'
    +'  </fieldset>'
    +'</form>'

    +'<div id="frame" class="width80pc border-std margt10pc pad2pc">&nbsp;</div>'

    +'<input id="JSON_TEST_DATA_CREATE" type="hidden" '
    +'    value=\'create Contact\n'
    +'          name="myhail aytorr", email="myhail@aytorr.com",phone="+33 489 71 51"\''
    +'/>'

    +'<input id="JSON_TEST_DATA_READ" type="hidden" '
    +'    value=\'read Contact\n'
    +'           name eq "myhail aytorr" and email == "myhail@aytorr.com"\''
    +'/>'

    +'<input id="JSON_TEST_DATA_UPDATE" type="hidden" '
    +'    value=\'update Contact\n'
    +'          phone="+32 489 33 71 51"\n'
    +'          name eq "myhail aytorr" and email == "myhail aytorr"\''
    +'/>'

    +'<input id="JSON_TEST_DATA_DELETE" type="hidden" '
    +'    value=\'delete Test\n'
    +'          name="myhail aytorr"\n'
    +'          name eq "myhail aytorr" and email == "myhail@aytorr.com"\''
    +'/>'
);

