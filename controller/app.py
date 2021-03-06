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
import controller.abstractpage as abstractpage
import controller.common as common

class IndexPage(abstractpage.AbstractPage):
  template_values = {
    'title' : 'app'
  }
  module_path='app'


application = webapp.WSGIApplication(
                                     [('/.*', IndexPage)],
                                     debug=True)

def real_main():
  run_wsgi_app(application)

def profile_main():
    # This is the main function for profiling
    # We've renamed our original main() above to real_main()
    import cProfile, pstats, StringIO
    prof = cProfile.Profile()
    prof = prof.runctx("real_main()", globals(), locals())
    stream = StringIO.StringIO()
    stats = pstats.Stats(prof, stream=stream)
    stats.sort_stats("time")  # Or cumulative
    stats.print_stats(80)  # 80 = how many to print
    # The rest is optional.
    # stats.print_callees()
    # stats.print_callers()
    logging.info("Profile data:\n%s", stream.getvalue())
    
if __name__ == "__main__":
  profile_main()
