/* in this order */
var madaa = {
  'options' : {
        'api' : {
            'url' : {
                'base'    : 'http://web-x0.appspot.com/',
                'params'  : 'process?module=dynamic_ajax_app&output=json'
            }
        },
         
        'html' : {
           '_' : null,
           'set' : function(html){
              madaa.options.html._ = html;
           },
           'container' : '#content',
           'title' : 'Fast Online CRUD',
           'text' : 'Create Database Entities and manage them online, using <em>natural</em> text commands. View the examples by clicking the corresponding buttons.<br>Enjoy.',
           'labels' : {
               'text_command' : 'Text command',
               'create' : 'create',
               'read' : 'read',
               'update' : 'update',
               'delete' : 'delete',
               'examples' : 'Sample commands:',
               'submit' : 'submit'
           }
        }
    }
};

var script_urls=[
    ['common' , 'http://localhost:8081/static/js/net.molhokwai/molhokwai.common.js'],
    ['app' , 'http://localhost:8081/static/js/net.molhokwai/molhokwai.ajax.app.js'],
    ['pg' , 'http://localhost:8081/static/js/net.molhokwai/molhokwai.ajax.app/text_command_hmi.html.js'],
    ['html' , 'http://localhost:8081/static/js/net.molhokwai/molhokwai.ajax.app/set_html.js']
];

var madaa_script=null;
var madaa_html_script=null;
var madaa_initialize=function(){
    $('script').each(function(){
        if ($(this)[0].id.toLowerCase()=='jquery.madaa'){
            madaa_script=$(this);
        }
    });
    
    for(var i=0;i<script_urls.length;i++){
        var k=script_urls[i][0];
        var val=script_urls[i][1];
        var script = document.createElement('script');
        script.id='madaa_'+k;
        script.src=val;
        if(k!='html'){
            //$('head').append(script);
            $.use(script.src);
        }
        else{
            madaa_html_script=script;
        }
    }
};

$.fn.madaa=function(options){
    if (!madaa_script){
        madaa_initialize();
    }
    //$('head').append(madaa_html_script);
    $.use(madaa_html_script.src);
    $(options.html.container).html(madaa.options.html._);
};

