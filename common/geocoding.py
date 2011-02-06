from google.appengine.ext import db

import settings
import util
import haversine

def getGeoPointRawJson(address):
    """Gets the Raw Json result GeoPoint through GeoCoding Api
        GeoCoding api Documentation : http://code.google.com/intl/fr-FR/apis/maps/documentation/geocoding/

        TODO : maps api key & url in config
        TODO : save address details returned by the api in db?
               => extra optional out parameter that collects the address

        Args:
            address : string

        Returns:
            dict              ,     String
            (deserialized)    ,    (raw serialized)
            Example:
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
    """
    parameters  = {
                   'q' : address,
                   'key' : settings.MAP_API_KEY,
                   'sensor' : 'false',
                   'output' : 'json'
                   }
    url = 'http://maps.google.com/maps/geo'
    return util.fetchHttpRequestData(parameters, url,request_output='json',request_method='GET')

def getDistance(geoPointJsonFrom, geoPointJsonTo):
    """TO BE FIXED : Gets distance between 2 raw Json GeoPoints

        Args:
            pointFrom : raw Json GeoPoint
            pointTo : raw Json GeoPoint

        Returns:
            Float
    """
    if (geoPointJsonFrom['Status']["code"] == 200
        and geoPointJsonTo['Status']["code"] == 200):
        return haversine.points2distance(
                            (
                             (geoPointJsonFrom['Placemark'][0]['Point']['coordinates'][1],0,0),
                             (geoPointJsonFrom['Placemark'][0]['Point']['coordinates'][0],0,0)
                            ),
                            (
                             (geoPointJsonTo['Placemark'][0]['Point']['coordinates'][1],0,0),
                             (geoPointJsonTo['Placemark'][0]['Point']['coordinates'][0],0,0)
                            )
                        )
    else:
        return -1