import wsgiref.handlers

from google.appengine.api import namespace_manager
from google.appengine.ext import webapp

# Called only if the current namespace is not set.
def namespace_manager_default_namespace_for_request():
    try:
        if get_current_user():
           return get_current_user().user_id()
        elif self.request.remote_addr:
            return self.request.remote_addr
        else:
          return namespace_manager.google_apps_namespace()
    except:
        return namespace_manager.google_apps_namespace()

