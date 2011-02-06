#!/usr/bin/python2.5
import os

"""HOST, APPLICATION PATH, SYSTEM NAMES..."""
HOST_NAME = ''
port = os.environ['SERVER_PORT']
if port and port != '80':
  HOST_NAME = '%s:%s' % (os.environ['SERVER_NAME'], port)
else:
  HOST_NAME = os.environ['SERVER_NAME']

APPLICATION_PATH = 'http://' + HOST_NAME
DEFAULT_APP_SYSTEM_NAME = 'web x.0 paradigm developments'

DEFAULT_APP_SYSTEM_THEME = 'default'

