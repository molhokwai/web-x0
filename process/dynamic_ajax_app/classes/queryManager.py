from types import *

import logging
import urllib

from google.appengine.ext import db

from common import util

class QueryManager(db.Model):
    """
            TODO:
               'cache' queries & not have to process them when already existing
                needs placeholders for variable values:
                  <code>
                    if dispatcher.request.url in self.queries:
                    request_query=RequestQuery.all().filter(' url = ', dispatcher.request.url).get()
                  </code>
            (,dispatcher=None parameter to be added...)
    """
    queries=db.StringListProperty()

    def fields(self,query):
        fields=' * '
        if type(query['fields'])==ListType:
            fields=','.join(query['fields'])
        elif type(query['fields'])==StringType:
            fields=query['fields']
        return fields

    def from_clause(self,query):
        return ' FROM '+query['entity']+' '

    def where_clause(self,query):
        where_clause=' WHERE '
        if (type(query['conditions'])==StringType
            or type(query['conditions'])==UnicodeType):
            where_clause+=query['conditions']
        elif type(query['conditions'])==DictType:
            where_clause+=util.code.generate.condition(query['conditions'])
        if where_clause.replace('WHERE','').replace(' ','')=='':
            return ''
        else:
            return where_clause

    def read(self,query):
        entities=[]

        select_clause='SELECT '+self.fields(query)
        from_clause=self.from_clause(query)
        where_clause=self.where_clause(query)

        q=db.GqlQuery(select_clause+from_clause+where_clause)
        for r in q:
            entities.append(r)

        return entities

class RequestQuery(db.Model):
    url=db.LinkProperty(required=True)
    query=db.StringProperty(required=True)
