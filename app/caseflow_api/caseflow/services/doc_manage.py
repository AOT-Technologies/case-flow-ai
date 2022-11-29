import json
import requests
from typing import Dict
from flask import current_app
from datetime import datetime


class DocManageService:
    """This class manages doc service."""
    @staticmethod
    def doc_upload_mutation(request,document,caseID)-> Dict:
        """ Do upload document """

        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 

        doc_id = document['doc_id']
        doc_name = document['doc_name']
        doc_dmsname = document['doc_dmsname']
        doc_type = document['doc_type']
        doc_size = document['doc_size']
        doc_description=document['doc_description']
        version=document['version']
        doc_modified = document['doc_modified']
        doc_created = document['doc_created']
        doc_download_url = document["doc_download_url"]
        dms_provider=document["dms_provider"]
        
        query = """mutation insertDocument {
        insertDocument(
            documentid: "%s"
            content: "nil"
            contentsize: %s
            contenttype: "%s"
            creationdate: "%s"
            creationuser: "%s"
            description: "%s"
            downloadurl: "%s"
            latestversion: "%s"
            metadata: "nil"
            modificationuser: "%s"
            name: "%s"
            docname: "%s"
            modificationdate: "%s"
            dms_provider: %s
            caseid : %s
            isdeleted : false
        ) {
            id,
            documentid,
            dms_provider
        }
        }

        #     """ % (doc_id,doc_size,doc_type,doc_created,doc_name,doc_description,doc_download_url,version,doc_name,doc_name,doc_dmsname,doc_modified,dms_provider,caseID)
       
        variables = {}
        try:
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
            data = r.json()
            documentInsertedID=data['data']['insertDocument']['id']
            if(documentInsertedID):
                queryVersion = """mutation insertVersions {
                insertVersions(
                docid: %s
                versions:"%s"
                documentid:"%s"
                modificationdate: "%s"
                creationdate: "%s"
                ) {
                id,
                documentid
                }
                }
                
        #     """ % (documentInsertedID,version,doc_id,doc_modified,doc_created)


                #variables = {"docid": documentInsertedID,"versions": version,"modificationdate": doc_modified,"creationdate": doc_created}
                headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
                res = requests.post(stepzen_endpoint_url, json={'query': queryVersion}, headers=headers)
                dataversion = res.json()

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
    def doc_update_mutation(doc_id,document):
        """ Do Update document """
        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 

        query = """
        query getDocument($id: Int!){
            getDocument(id: $id){
                documentid                
                
            }
        }
            """
        variables = {"id": doc_id}
        headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
        r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
        data = r.json()
        documentId=data['data']['getDocument']['documentid']

        doc_name = document['doc_name']
        doc_type = document['doc_type']
        doc_size = document['doc_size']
        description=document['doc_description']
        version=document['version']
        doc_modified = document['doc_modified']

        query = """mutation updateDocument {
        updateDocument(
            documentid: "%s"
            name: "%s"
            contentsize: %s
            contenttype: "%s"
            creationuser: "%s"
            description: "%s"
            downloadurl: "%s"
            latestversion: "%s"
            modificationdate: "%s"
            modificationuser: "%s"
    
        ) {
            documentid,
            id
        }
        }

        #     """ % (documentId,doc_name,doc_size,doc_type,doc_name,description,doc_name,version,doc_modified,doc_name)


        variables = {}
        try:
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
            data = r.json()
            #documentInsertedID=data['data']['updateDocument']['id']

            queryVersion = """mutation insertVersions {
                insertVersions(
                docid: %s
                versions:"%s"
                documentid:"%s"
                modificationdate: "%s"
                creationdate: "%s"
                ) {
                id
                }
                }
                
            #     """ % (doc_id,version,documentId,doc_modified,doc_modified)
            
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            res = requests.post(stepzen_endpoint_url, json={'query': queryVersion}, headers=headers)
            dataversion = res.json()

            response = {
                    "message": dataversion,
                    "status": "success",
            } 

            print(data)
        except TypeError as update_error:
            response = {
                "message": "Updation Error",
                "error": update_error,
            }    
        return response

    @staticmethod
    def fetchDocId(documetId):
        """ fetch id from  document by documentid """
        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 
        query = """
        query getDocument($id: Int!){
            getDocument(id: $id){
                documentid
                downloadurl
                name
                contenttype
                
            }
        }
            """
        variables = {"id": documetId}
        try:
            print(query)
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
            data = r.json()
            documentId=data['data']['getDocument']['documentid']
            doc_download_url = data['data']['getDocument']['downloadurl']
            doc_name = data['data']['getDocument']['name']
            doc_contenttype = data['data']['getDocument']['contenttype']
            response = {
                    "documentId": documentId,
                    "doc_download_url":doc_download_url,
                    "name": doc_name,
                    "contenttype": doc_contenttype,
                    "status": "success",
            } 
        except TypeError as update_error:
            response = {
                "message": "documentid fetch Error",
                "error": update_error,
            }    
        return response    
     

     
    @staticmethod
    def doc_fetch_alldata():
        """ Do Fetch  document List """
        stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
        stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 
        try:
            query = """
           query MyQuery {
            getDocumentList {
                name
                id
                downloadurl
                documentid
                description
                creationdate
                modificationdate
                contentsize
                dms_provider
                docname
                versionsList {
                versions
                }
            }
            }

                """
            variables = {}
            headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
            r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
            data = r.json()
            response = {
                    "message": data,
                    "status": "success",
            } 
        except TypeError as update_error:
            response = {
                "message": "Fetch Error",
                "error": update_error,
            }    
        return response

    # @staticmethod
    # def fetchdocumentUsingCaseId(caseId):
    #     """ fetch id from  document by documentid """
    #     stepzen_endpoint_url =current_app.config.get("STEPZEN_ENDPOINT_URL")  
    #     stepzen_api_key =current_app.config.get("STEPZEN_API_KEY") 
    #     query = """
    #     query getDocumentUsingCaseId($id: Int!){
    #         getDocumentUsingCaseId(id: $id){
    #             id
    #             name
  
    #         }
    #     }
    #         """
    #     variables = {"id": caseId}
    #     try:
    #         print(query)
    #         headers = {"Content-Type": "application/json", "Authorization": "Apikey "+stepzen_api_key}
    #         r = requests.post(stepzen_endpoint_url, json={'query': query, 'variables': variables}, headers=headers)
    #         data = r.json()
    #     except:
    #         pass