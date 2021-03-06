import os
import cgi

from types import *

# we're not going through the main anymore, so this is required
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

#google appengine
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

#processors
import process.dynamic_ajax_app.manage as dynamic_ajax_app

class MainPage(webapp.RequestHandler):
  def get(self):
    """Dispatches processes according to request"""
    def setParameters(self,parameters,handle_special_chars=None):
        params = parameters
        for key in params.keys():              
            v=self.request.get(key)
            if handle_special_chars is None:
              if type(v)==StringType or type(v)==UnicodeType:
                params[key]=unicode(v)
            else:
              params[key]=v
        return params

    output = ""
    prc = None
    # process
    prc = dynamic_ajax_app.Manage
    if self.request.get("module"):
        prc = {
              'dynamic_ajax_app' : lambda x : dynamic_ajax_app.Manage
              }.get(self.request.get("module"),
                       lambda x: '' )(self.request.get("module"))

        if type(prc) not in [StringType, UnicodeType]:
            if 'handle_special_chars' in prc.__dict__:
              prc = prc(setParameters(self,prc.parameters,
                                      handle_special_chars=prc.handle_special_chars))
            else: prc = prc(setParameters(self,prc.parameters))

            if 'handle_special_chars' in prc.__dict__:
              prc.handle_special_chars()
    else:
        prc=prc(None,self.request)
        
    if type(prc) not in [StringType, UnicodeType]:
        prc.dispatcher=self

        #execute
        output = prc.execute()

    # content type
    if self.request.get("output") in ['json','js']:
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.out.write(output)
    elif self.request.get("output") == "url":
        self.redirect(output)
    else:
        self.response.headers['Content-Type'] = 'text/html'
        self.response.out.write(output)

application = webapp.WSGIApplication(
                                     [('/.*', MainPage)],
                                     debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()
