#!/usr/bin/python2.5
#
# Copyright 2008 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""System-wide configuration variables."""

import datetime
import settings

# This HTML block will be printed in the footer of every page.
FOOTER_HTML = (
    '<p>Copyleft (c) 2010 '+settings.HOST_NAME+'. | '
    '<a href="http://code.google.com/appengine">Powered by '
    'Google App Engine</a></p>')


# File caching controls
FILE_CACHE_CONTROL = 'private, max-age=86400'
FILE_CACHE_TIME = datetime.timedelta(days=1)


# Title for the website
SYSTEM_TITLE = settings.DEFAULT_APP_SYSTEM_NAME

# Description for the website
SYSTEM_DESCRIPTION = 'web x.0 paradigm developments'

# Unique identifier from Google Analytics (ie. UA-xxxxxxx-x)
ANALYTICS_ID = 'UA-5101967-1'

# Name of theme for your site, must be located in
# 'templates/themes/{FOLDER NAME}' where your customized
# base and page files should be located
SYSTEM_THEME_NAME = settings.DEFAULT_APP_SYSTEM_THEME
