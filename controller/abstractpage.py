#!/usr/bin/python2.5
#
import os
import cgi
import logging

#google appengine
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

#application
import settings
import controller.common as common


class AbstractPage(webapp.RequestHandler):
  template_values = {}
  module_path=''

  """Explicit
  """
  def get(self):
    # output
    common.outputTemplate(self, self.template_values, self.module_path)

application = webapp.WSGIApplication(
                                     [('/.*', IndexPage)],
                                     debug=True)

