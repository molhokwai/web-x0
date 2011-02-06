var molhokwai = {
    source: {
        baseUrl: ''
    },

	page : {
		originalUrl : ''
	},

    common: {
        display: {
            userMessage: {
                set:
				/**********
                 @param	params.msg			required
                 @param	params.displayTime 	required
					 (seconds) msg will be hidden after the display time
                 @param	params.type			none | yes | no
                 ***********/
                function(params) {
                    // TODO : put message display control id in configuration
                    var elementId = 'userMessage';
                    if (params['elementId'])
                        elementId = params['elementId'];
					if (document.getElementById(elementId))
					{
	                    document.getElementById(elementId).innerHTML = params['msg'];
						var cssClass=molhokwai.common.display.userMessage.getCssClass(params);
	                    document.getElementById(elementId).className=cssClass;
						if (elementId!='userMessage')
							document.getElementById('userMessage').className=cssClass;
	                    molhokwai.common.display.userMessage.show(params);
					}
					else
					{
						alert(elementId);
					}
                },

                add:
				/**********
                 * @param	msg			required
                 * @param	displayTime required
				 *	  (seconds) msg will be hidden after the display time
                 * @param	type		none | yes | no
                 ***********/
                function(params) {
                    // TODO : put message display control id in configuration
                    var elementId = 'userMessage';
                    if (params['elementId'])
                        elementId = params['elementId'];
					if (params['type']=='no')
						molhokwai.common.display.userMessage.handleErrorText(params);
                    if (document.getElementById(elementId).innerHTML != '') {
                        var cssClass = molhokwai.common.display.userMessage.getCssClass(params);
                        document.getElementById(elementId).innerHTML = 
							document.getElementById(elementId).innerHTML +
							'<span class="' + cssClass + '">' + params['msg'] + '</span>';
                        molhokwai.common.display.userMessage.show(params);
                    }
                    else {
                        molhokwai.common.display.userMessage.set(params);
                    }
                },

                getCssClass: function(params) {
                    switch (params['type']) {
                        case 'yes':
                            return 'user-message yes';
                            break;
                        case 'no':
                            return 'user-message no';
                            break;
                        case 'none':
                        default:
                            return 'user-message ';
                            break;
                    }
                },

                show: function(params) {
					if (params['msg'] && params['msg'].replace(' ', '').length>0)
					{
						if ($jQuery)
							$jQuery(".user-message").show("slow");
						else
							document.getElementsByClassName('user-message')[0].style.display='';
						
						if (params['displayTime']) {
							var elementId = 'userMessage';
							if (params['elementId'])
								elementId = params['elementId'];
							if ($jQuery)
								$jQuery(".user-message").html(document.getElementById(elementId).innerHTML);
							else
								document.getElementsByClassName('user-message')[0].innerHTML=
									document.getElementById(elementId).innerHTML;
								
							/**
							molhokwai.common.display.userMessage.set._tid = window.setTimeout('document.getElementById("' + elementId + '").innerHTML = "";' +
							'document.getElementById("' + elementId + '").className = "hideme";', params['displayTime'] * 1000);
							**/
							window.clearTimeout(molhokwai.common.display.userMessage.set._tid);
							if ($jQuery)
								molhokwai.common.display.userMessage.set._tid = 
									window.setTimeout('$jQuery(".user-message").hide("slow");', params['displayTime'] * 1000);
							else
								molhokwai.common.display.userMessage.set._tid = 
									window.setTimeout('document.getElementsByClassName("user-message")[0].style.display="none";', params['displayTime'] * 1000);
						}
					}
                },

                hide: function() {
					window.clearTimeout(molhokwai.common.display.userMessage.set._tid);
					if ($jQuery)
						$jQuery(".user-message").hide("slow");
					else
						document.getElementsByClassName("user-message")[0].style.display="none";
                },

				/**********
				* sets the full message and truncates it if necessary
				* @arguments params.msg
                 ***********/
                handleErrorText: function(params) {
                    document.getElementById('devMessage').innerHTML+=params['msg'];
					if (params['msg'].length>100)
						params['msg']='<br/><br/>---------------------------------------------------------<br/>'
							+params['msg'].substring(0,100)+'...(<i>complete message in hidden #devMessage</i>)';
                },
            }
        },

        screen : {
			size : {
				get :
					function(){
						var screenW = 640, screenH = 480;
						if (parseInt(navigator.appVersion)>3) {
							screenW = screen.width;
							screenH = screen.height;
						}
						else if (navigator.appName == "Netscape"
							&& parseInt(navigator.appVersion)==3
							&& navigator.javaEnabled()) {
							var jToolkit = java.awt.Toolkit.getDefaultToolkit();
							var jScreenSize = jToolkit.getScreenSize();
							screenW = jScreenSize.width;
							screenH = jScreenSize.height;
						}
						return {'width':screenW,'height':screenH};
					}
			}
		},

		/** event handling **/
        event: {
            /***
            * 		Page just has to declare an onPageLoad function
            * 		to have it run on page load...
            ***/
            onpageload: function() {
				String.prototype.trim = function () {
					return this.replace(/^\s*/, "").replace(/\s*$/, "");
				};
				molhokwai.page.originalUrl=window.location.href;

                try {
                    if (onPageLoad) onPageLoad();
                }
                catch (e){ }
            },

            callback: {
                /** functions must be set on page load **/
                fcts: {
                    _value: [],
                    /** function is assigned below (end of file)... **/
                    _default: function(evt, obj) {
                        var ok = parseInt(obj.a.status) == 1
								&& parseInt(obj.a.result) == 1;
                        if (!ok && obj.a.message && obj.a.message != '') {
                            molhokwai.common.display.userMessage.set({
                                'msg': obj.a.message,
                                'type': (ok ? 'yes' : 'no'),
                                'displayTime': 30
                            });
                        }

                        switch (evt.toLowerCase()) {
                            case 'register':
                                if (ok) {
                                    molhokwai.common.display.userMessage.add({
                                        'msg': '! {{ languageDictionary. }}you will be redirected and can start reading in a few seconds...',
                                        'type': resType,
                                        'displayTime': 30
                                    });
                                    window.setTimeout(                                /** TODO : default location in config **/
                                    /** TODO : Merge sign in / register redirections & factorize **/
                                    'window.location = "' +
                                    (molhokwai.common.event.register.redirectUrl ? molhokwai.common.event.register.redirectUrl : (molhokwai.config.site.homeUrl ? molhokwai.config.site.homeUrl : '/')) +
                                    '";', 3000);
                                }
                                break;
                            default:
                                break;
                        }
                    },

                    add: function(fct) {
                        molhokwai.common.event.callback.fcts._value.push(fct);
                    }
                },

                /** callback functions executed at the end of event  **/
                execute: function(evt, obj) {
                    for (var i = 0, fct; fct = molhokwai.common.event.callback.fcts._value[i]; i++) {
                        fct(evt, obj);
                    }
                }
            },

            signin: {
                redirectUrl: null,
                callback: {
                    fct: function(evt, obj) {
                        var ok = obj.a.status == 1 && obj.a.result == 1;
                        var resType = ok ? 'yes' : 'no';
                        switch (evt.toLowerCase()) {
                            case 'signin':
                                if (ok) {
                                    molhokwai.common.display.userMessage.add({
                                        'msg': '... {{ languageDictionary. }}redirecting you...',
                                        'type': resType,
                                        'displayTime': 30
                                    });
                                    window.location = molhokwai.common.event.signin.redirectUrl ? molhokwai.common.event.signin.redirectUrl : (molhokwai.config.site.homeUrl ? molhokwai.config.site.homeUrl : '/');
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            },

            register: {
                redirectUrl: null
            },

			trigger:
				function(event,elementId){
					$jQuery("#"+elementId).trigger(event.toLowerCase());
				}
        },

        session: {
            data: {
                required: {
                    auth_data: true
                },
                /** @todo : use javascript hashtable **/
                _data: {},
                get: function(key) {
                    return molhokwai.common.session.data._value[key];
                },
                set: function(key, value) {
                    molhokwai.common.session.data._value[key] = value;
                },
                remove: function(key) {
                    molhokwai.common.session.data._value[key] = null;
                }
            }
        },

        element: {
            getInnerHtml:
                function(elid) {
                    return document.getElementById(elid).innerHTML;
                },
            setInnerHtml:
                function(elid, val) {
                    document.getElementById(elid).innerHTML = val;
                }
        },

        widgets: {
            tabs: {
				tab: {
					onSelected:
						function(hash)
						{
							pageTracker._trackPageview(molhokwai.page.originalUrl+'/'+hash);
							molhokwai.common.display.userMessage.hide();
						}
				}
			}
        },

		form: {
			id : '',

			serialize:
				function(formid) {
					data = {};
					items = $jQuery("#"+formid).serializeArray();
					$jQuery.each(items,function(i,item) {
							data[item['name']]=item['value'];
					});
					return data;
				},
			submit: {
				messages: { initial: '', success: '', error: '' },

				ajax:
					function (formid,messages,url,callback) {
						molhokwai.common.form.id=formid;
						molhokwai.common.form.submit.messages=messages;
						items = {};
						items = molhokwai.common.form.serialize(formid);
						if (url==null)
							url = $jQuery("#"+formid).attr("action");
						if(""==url)
						{
							alert("Cannot submit form. No action specified");
							return false;
						}
						callback = callback?callback:molhokwai.common.form.submit.callback;
						$jQuery.get(url,items,callback);
					},

				callback:
					function (data) {
						var json=eval("("+data+")");
						if (parseInt(json.status)==1 && parseInt(json.result)==1) {
							$jQuery("#"+molhokwai.common.form.id).html("");
							$jQuery("#userMessage").html("");
							$jQuery("#userMessage").append(molhokwai.common.form.submit.messages.success);
							$jQuery("#userMessage").addClass('yes');
						}
						else {
							$jQuery("#userMessage").html("");
							$jQuery("#userMessage").append(molhokwai.common.form.submit.messages.error);
							$jQuery("#userMessage").append(json.message);
							$jQuery("#userMessage").addClass('no');
						}
					}
			}
		},
	
		lang : {
			change : function(code) {
				window.location=molhokwai.util.url.parameter.set('lang',code);
				
			}
		},
		
		menu: {
			items: {
				/* used for the highlight function, changeable by app/site */
				idPrefix: 'menu_link_',
				home: 'menu_link_home',
				
				selected: {
					highlight: 
						function(){
							var id=molhokwai.common.menu.items.home;
							var path=window.location.pathname.substring(1);
							path=path.split('/')[0];
							if (path!='') {
								id=molhokwai.common.menu.items.idPrefix+path;
							}
							var cn=window.document.getElementById(id).className;
							window.document.getElementById(id).className=(cn?cn+' ':'')+'current_page_item';
						}
				}
			}
		}
	}
};

// set events
window.onload = molhokwai.common.event.onpageload;

// set default event callback function
molhokwai.common.event.callback.fcts.add(molhokwai.common.event.callback.fcts._default);

// global variables
/** PYTHON TO JS : For seamlessly passing
 python/django template None, True, False values
 **/
var None = null;
var False = false;
var True = true;

