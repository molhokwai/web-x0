from types import *

import datetime
import logging

from common import util

class FieldStringOutput():
    @staticmethod
    def param_field_equals_value(field):
        """
            Output for dynamic entity parameter code execution
            Types: see http://code.google.com/intl/fr-FR/appengine/docs/python/datastore/typesandpropertyclasses.html
            Only one of those types is allowed"""
        field=util.Obj(field)
        sname=field.name
        stype='db.'+field.type+'Property'

        srequired=None
        sdefault=None
        scollection_name=None
        schoices=None

        if hasattr(field,"required"):
            srequired='required=True'
        if hasattr(field,"default"):
            quot=util.code.generate.get_quoting_char_string(field.type)
            sdefault='default='+quot+field.default+quot
        if hasattr(field,"collection_name"):
            scollection_name='collection_name="'+field.collection_name+'"'
        if hasattr(field,"choices"):
            schoices='choices=set(["'+('","'.join(schoices))+'"])'

        soutput=sname+'='+stype+'('
        trimr=False
        attributes=[srequired,sdefault,scollection_name,schoices]
        for i in range(len(attributes)):
            if not attributes[i] is None:
                soutput+=attributes[i]+','
                trimr=True
        if trimr:soutput=soutput[:len(soutput)-1]
        soutput+=')'
        return soutput

    @staticmethod
    def field_operator_value(field,operator='='):
        field=util.Obj(field)
        sname=field.name
        svalue=None

        quot=''
        if field.type in ['String','DateTime','Date','Time','User','Text',
                          'Category','Email','PhoneNumber','PostalAddress']:
            quot='"'
        svalue=quot+field.value+quot
        soutput=sname+operator+svalue
        return soutput


