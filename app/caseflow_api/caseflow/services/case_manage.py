import json
import requests
from typing import Dict
from flask import current_app
from datetime import datetime


class CaseManageService:
    """This class manages case service."""
    @staticmethod
    def create_new_case(values)-> Dict:
        """ create new document """

        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 

        name  = values['name']
        description =  values["description"]
   
    
        query = """mutation insertCases {
        insertCases(
            name: "%s"
            desc: "%s"
        ) {
            id,
            name,
            desc
        }
        }

        #     """ % (name,description)
       
        variables = {}
        try:
            print(query)
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
            data = r.json()
            

            response = {
                    "message": data,
                    "status": "success",
                } 
        except TypeError as insertion_error:
            response = {
                "status": "error",
                "error": insertion_error,
            }    
        return response


   