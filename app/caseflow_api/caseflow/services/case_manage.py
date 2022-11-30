import requests
from typing import Dict
from flask import current_app


class CaseManageService:
    """This class manages case service."""
    @staticmethod
    def create_new_case(values)-> Dict:
        """ create new case """

        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 

        name  = values['name']
        description =  values["description"]
   
    
        query = """mutation insertCases {
        insertCases(
            name: "%s"
            desc: "%s"
            isdeleted : false
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
    
    @staticmethod
    def delete_case(Id,isdeleted="true")-> Dict:
        """ delete  case by Id"""

        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 

        query = """mutation deleteCases {
        deleteCase(

            isdeleted : %s
            id : %s
        ) {
            id,
            name,
            desc
        }
        }

        #     """ % (isdeleted,int(Id))
       
        variables = {}
        try:
            print(query)
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
            data = r.json()
            if "errors" in data.keys() :
                status = "error"
            else :
                status = "success"
            response = {
                    "message": data,
                    "status": status,
                } 
        except TypeError as insertion_error:
            response = {
                "status": "error",
                "error": insertion_error,
            }    
        return response


    
    def delete_case_documents(Id)-> Dict:
        """ delete  case documents by Id"""

        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 

        query = """mutation deleteDocumentByCaseId {
        deleteDocumentByCaseId(

            isdeleted : true
            caseid : %s
        ) {
            id,
            name,
            caseid
        }
        }

        #     """ % (int(Id))
       
        variables = {}
        try:
            print(query)
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
            data = r.json()
            if "errors" in data.keys() :
                status = "error"
            else :
                status = "success"
            response = {
                    "message": data,
                    "status": status,
                }  
        except TypeError as insertion_error:
            response = {
                "status": "error",
                "error": insertion_error,
            }    
        return response



    


   