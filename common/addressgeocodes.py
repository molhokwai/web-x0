import time

from google.appengine.ext import db

from django.utils import simplejson as json

import util
import model.common
import model.address

import geocoding

def getGeoPointRawJson(address, apiCallWait=False):
    """Gets the Raw Json result GeoPoint from the database if address is saved.
       Otherwise gets it through GeoCoding Api and saves address details.
       Returns an extra boolean to specify that the geocoding api was called
       and that the next one should eventually wait a few seconds before execution...
       (see http://code.google.com/intl/fr-FR/apis/maps/faq.html#geocoder_limit
       see TODO below)

        TODO : All Api calls should be off loaded to the client side
                - client checks if address exists in db
                - calls api if not and sends results to server for storage

        Args: String

        Returns: Dict, Address (Model), boolean
                 deserialized, serialized, api was called
            Example:
            BELGIUM
            {
              "name": "1600 Amphitheatre Parkway, Mountain View, CA",
              "Status": {
                "code": 200,
                "request": "geocode"
              },
              "Placemark": [ {
                "id": "p1",
                "address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
                "AddressDetails": {
                  "Country":{
                    "CountryNameCode": "US",
                    "CountryName": "USA",
                    "AdministrativeArea":{
                      "AdministrativeAreaName": "CA",
                      "Locality":{
                        "LocalityName": "Mountain View",
                        "Thoroughfare":{
                          "ThoroughfareName": "1600 Amphitheatre Pkwy"
                        },
                        "PostalCode":{
                          "PostalCodeNumber": "94043"
                        }
                      }
                    }
                  },
                  "Accuracy": 8
                },
                "Point": {
                  "coordinates": [ [longitude], [latitude], [geodesic height] ]
                }
              } ]
            }

            INDIA
		{
		  "name": "shankar road, delhi   india",
		  "Status": {
			"code": 200,
			"request": "geocode"
		  },
		  "Placemark": [ {
			"id": "p1",
			"address": "Shankar Road, Old Rajender Nagar, Delhi, India",
			"AddressDetails": {
		   "Accuracy" : 4,
		   "Country" : {
			  "AdministrativeArea" : {
				 "AdministrativeAreaName" : "Delhi",
				 "SubAdministrativeArea" : {
					"DependentLocality" : {
					   "AddressLine" : [ "Shankar Road" ],
					   "DependentLocalityName" : "Old Rajender Nagar"
					},
					"SubAdministrativeAreaName" : "New Delhi"
				 }
			  },
			  "CountryName" : "India",
			  "CountryNameCode" : "IN"
		   }
		},
			"ExtendedData": {
			  "LatLonBox": {
				"north": 28.6495713,
				"south": 28.6299856,
				"east": 77.2026257,
				"west": 77.1706109
			  }
			},
			"Point": {
			  "coordinates": [ 77.1866183, 28.6397789, 0 ]
			}
		  } ]
		}
    """
    results = model.common.filter(model=model.address.Address,
                                  fetch_nr=1,name=address)
    addressModel = None
    for r in results:
        addressModel = r

    if addressModel is not None:
        return json.loads(addressModel.rawJson),addressModel,False
    else:
        if apiCallWait: time.sleep(2)
        geoPointRawJson,geoPointRawJsonString = geocoding.getGeoPointRawJson(address)
        if not geoPointRawJson is None and geoPointRawJson['Status']['code'] == 200:
            from model import common
            addressModel = model.address.Address(
                                                 parent=common.getGlobalParent(),
                                                 name = geoPointRawJson['name'],
                                                 address = geoPointRawJson['Placemark'][0]['address'],
                                                 rawJson = geoPointRawJsonString,
                                                 geoPoint = db.GeoPt(
                                                    lat=geoPointRawJson['Placemark'][0]['Point']['coordinates'][1],
                                                    lon=geoPointRawJson['Placemark'][0]['Point']['coordinates'][0]
                                                    )
                                                 )
            addressModel.put()
        return geoPointRawJson,addressModel,True


def getGeoPointFromJson(geoPointJson):
    """Gets the GeoPoint from a raw Json GeoPoint
        GeoCoding api Documentation : http://code.google.com/intl/fr-FR/apis/maps/documentation/geocoding/

        Args:
            address : string

        Returns:
            db.GeoPt
    """
    if (geoPointJson['Status']["code"] == 200):
        return db.GeoPt(
                         geoPointJson['Placemark'][0]['Point']['coordinates'][1],
                         geoPointJson['Placemark'][0]['Point']['coordinates'][0],
                        )
    else:
        return None

def getGeoPoint(address):
    """Gets the Raw Json result GeoPoint from the database if address is saved.
       Otherwise gets it through GeoCoding Api and saves address details.

        Args:
            address : string

        Returns:
            db.GeoPt
    """
    result = getGeoPointRawJson(address)
    if result is not None:
        return getGeoPointFromJson(result)
    else:
        return None
