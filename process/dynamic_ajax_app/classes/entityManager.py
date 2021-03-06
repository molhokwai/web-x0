from types import *

import datetime
import logging

from google.appengine.ext import db

import fieldStringOutput 
import queryManager
FieldStringOutput=fieldStringOutput.FieldStringOutput
QueryManager=queryManager.QueryManager

class EntityManager(db.Model):
    """See sample JSON entities structure in execute method"""
    entities=db.StringListProperty()

    def instance_declaration_string(self,entity,action):
        fso=''
        for i in range(len(entity['fields'][action])):
            field=entity['fields'][action][i]
            fso+=FieldStringOutput.param_field_equals_value(field)+'\n\t'
        return 'class %s(db.Expando):\n\t%s\n' % (entity['type'], fso)

    def create(self,entity):
        exec self.instance_declaration_string(entity,'create')

        fso=''
        i=0
        for i in range(len(entity['fields']['create'])):
            field=entity['fields']['create'][i]
            if i>0: fso+='\n\t,'
            fso+=FieldStringOutput.field_operator_value(field)
            i+=1
        exec entity['type']+'(\n\t'+fso+').put()\n'

        if not entity['type'] in self.entities:
            self.entities.append(entity['type'])
            self.put()
            
        return 1

    def read(self,entity):
        query={
            'action':'read',
            'fields':' * ',
            'entity':entity['type'],
            'conditions': entity['conditions']
        }
        return QueryManager().read(query)


    def update(self,entity):
        exec self.instance_declaration_string(entity,'update')

        entities=self.read(entity)
        for i in range(len(entities)):
            entity_obj=entities[i]
            feeso=''
            i=0
            for i in range(len(entity['fields']['update'])):
                field=entity['fields']['update'][i]
                if i>0: feeso+='\n'
                feeso+='entity_obj.'+FieldStringOutput.field_operator_value(field)
                i+=1
            exec feeso+'\n'+'entity_obj.put()\n'
            
        return 1

    def delete(self,entity):
        exec self.instance_declaration_string(entity,'delete')

        entities=self.read(entity)
        nr=0
        for i in range(len(entities)):
            entities[i].delete()
            nr+=1
                    
        return nr

