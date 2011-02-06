from types import *

import datetime
import logging
import urllib

import google.appengine.api.urlfetch as urlfetch
from django.utils import simplejson as json
from google.appengine.ext import db

from common import util
import process

from classes import queryManager
from classes import entityManager
QueryManager=queryManager.QueryManager
EntityManager=entityManager.EntityManager

class Manage():
    """To be able to build application without (server-side) coding:
        - create entities (models) and manage them dynamically
    """
    parameters = {'action' : None, 'sub_action' : None,
                  'command_json' : None, 'filename' : None, 
                  'output' : None
                }
    output = {
     "status" : 0,
     "message" : "",
     "result" : 0
    }

    """
    from common import util
    def handle_special_chars(self):
      params=self.parameters
      for key in params:
          if (type(params[key])==StringType
              or type(params[key])==UnicodeType):
            params[key]=util.stringToAscii(params[key])
    """

    def __init__(self,parameters=None,request=None):
        if parameters:
            self.parameters = parameters
        else:
            self.parameters['action']='test_hmi_html'
            rel_path='dynamic_ajax_app/'
            if request:
            
                r_p_s=request.path.split('/')
                r_p_s_len=len(r_p_s)
                if r_p_s_len>=2:
                
                    if r_p_s[1] and r_p_s[1] in ['site', 'blog', 'cms', 'website', 'page', 'pages']:
                        import os
                        rel_path+='site/fopt/'
                        f_r_p='%s/%s.html' % (rel_path, r_p_s[r_p_s_len-1].replace('.html', ''))
                        
                        if os.path.isfile(f_r_p):
                            rel_path=None
                            self.parameters['filename']=f_r_p
                            
                        else:
                            self.parameters['filename']='index.html'
                
                    elif r_p_s[1] in ['demo']:
                        self.parameters['filename']='app_command_hmi.html'
                        
                    elif len(r_p_s)>2:
                          self.parameters['filename']='app.html'

                    elif r_p_s[1]:
                        self.parameters['filename']='%s.html' % r_p_s[1].replace('.html', '')
                    
                    else:
                        self.parameters['filename']='app_command_hmi.html'
                
                if rel_path:
                  self.parameters['filename']='%s/%s' % (rel_path, self.parameters['filename'])

    def test_hmi_html(self):
        file_rel_path='dynamic_ajax_app/test_hmi.html'
        if self.parameters['filename']:
            file_rel_path='%s' % self.parameters['filename']
            
        f=open(file_rel_path, 'r')
        self.output=f.read()
        f.close()
        
    def execute(self):
        """Actual execution

            Returns:
              None

            Args:
                None
        """
        try:
            method = {
                      'dynamic_ajax_app' : lambda x : self.process,
                      'test_hmi_html' : lambda x : self.test_hmi_html
                     }.get(self.parameters['action'], lambda x: self.process)(self.parameters['action'])
            method()
        except Exception, exception:
            logging.error(str(exception))
            self.output["message"] = str(exception)

        return str(self.output)


    def execute_command(self, _command, _type='JSON'):
        command_json=_command
        entity_manager=EntityManager()
        entities_output=[]
        if command_json.has_key('entities'):
            for i in range(len(command_json['entities'])):
                entity=command_json['entities'][i]
                _function={
                    'create' : lambda x: entity_manager.create,
                    'read' : lambda x: entity_manager.read,
                    'update' : lambda x: entity_manager.update,
                    'delete' : lambda x: entity_manager.delete,
                    }.get(entity['action'],lambda x:'')(entity['action'])
                res=_function(entity)
                
                if entity['action']=='read':
                    for i in range(len(res)):
                        entities_output.append(json.dumps(res[i].__dict__))
                else:
                    entities_output.append(res)
                        

        if command_json.has_key('queries'):
            query_manager=QueryManager()
            for i in range(len(command_json['queries'])):
                query=command_json['queries'][i]
                _function={
                    """only read, in gql: see
                        http://code.google.com/appengine/docs/python/datastore/gqlreference.html
                    """
                    'read' : lambda x: query_manager.read
                    }.get(query['action'],lambda x:'')(query['action'])
                res=_function(query)
                if query['action']=='read':
                    for i in range(len(res)):
                        entities_output.append(json.dumps(res[i].__dict__))
                else:
                    entities_output.append(res)

        return entities_output


    def process(self):
        """Gets the JSON value and parses it to execute it's (command) structure.

            RULES : The create parameters of en entity should always be passed, in all cases.
                    Needed for dynamic entity declaration.

            Args :
                None

            Returns :
                JSON (String)
        """
        if self.parameters['action']=='test':
            import namespace_unittest as nut
            res={
	            'CREATE' : None,
	            'READ' : None,
	            'UPDATE' : None,
	            'DELETE' : None
            }
            self.output["message"] = ''
                        
            CRUD_LIST=['CREATE', 'READ', 'UPDATE', 'DELETE']
            for i in range(len(CRUD_LIST)):
                crud_action=CRUD_LIST[i]
                command_json=nut.JSON_TEST_DATA[crud_action]
                
                try:
                    res[crud_action]=self.execute_command(command_json)
                    self.output["message"]+='%s succesfull | ' % crud_action
                except Exception, ex:
                    res[crud_action]='Exception %s ' % ex.message

            self.output["status"] = process.Status.SUCCESS
            self.output["result"] = res
        else:
            command_json=json.loads(str(urllib.unquote(self.parameters['command_json'])))
            res=self.execute_command(command_json)

            self.output["status"] = process.Status.SUCCESS
            self.output["message"]='done'
            self.output["result"] = res

        return self.output

