"""API endpoints for managing cms repo."""
from http import HTTPStatus
import json
import requests
from cmislib.exceptions import UpdateConflictException
from flask import current_app, request,make_response,Response
from flask_restx import Namespace, Resource,reqparse
from requests.auth import HTTPBasicAuth
from caseflow.services import DocManageService
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode
from caseflow.utils import auth, cors_preflight
from caseflow.utils.enums import CaseflowRoles
from werkzeug.datastructures import FileStorage
from caseflow.resources.alfresco_helper import AlfrescoHelper




# keeping the base path same for cmis operations (upload / download) as cmis/

API = Namespace("CMIS_ALFRESCO", description="CMIS ALFRESCO Connector")


@cors_preflight("GET,POST,OPTIONS")
@API.route("/upload", methods=["POST", "OPTIONS"])
class CMISConnectorUploadResource(Resource):
    """Resource for uploading cms repo."""
    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('upload', location='files',type=FileStorage, required=True)
    upload_parser.add_argument('name', type=str, location='form', required=True)
    upload_parser.add_argument('description', type=str, location='form', required=True)


    @API.expect(upload_parser)
    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])
    def post(self):
        """New entry in cms repo with the new resource."""
        #cms configuration
        cms_repo_url = current_app.config.get("CMS_REPO_URL") 
        cms_repo_username =current_app.config.get("CMS_REPO_USERNAME")  
        cms_repo_password =current_app.config.get("CMS_REPO_PASSWORD") 
        cms_repo_folder_name = current_app.config.get("CMS_REPO_FOLDER_NAME")
        args = self.upload_parser.parse_args()


        if cms_repo_url is None:
            return {
                "message": "CMS Repo Url is not configured"
            }, HTTPStatus.INTERNAL_SERVER_ERROR
   
        try:
            url = cms_repo_url + "1/nodes/-root-/children"
            data = AlfrescoHelper.format_data_rest_api(args,cms_repo_folder_name) 
            return AlfrescoHelper.file_upload_alfresco(cms_repo_url,cms_repo_username,cms_repo_password,url,data)
        
        except UpdateConflictException:
            return {
                "message": "Unable to  upload files in the request", "error" : e.message
            }, HTTPStatus.INTERNAL_SERVER_ERROR


            
 
        

@cors_preflight("GET,POST,OPTIONS,PUT")
@API.route("/update", methods=["PUT", "OPTIONS"])
class CMISConnectorUploadResource(Resource):
    """Resource for uploading cms repo."""

    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('upload', location='files',type=FileStorage, required=True)
    upload_parser.add_argument('id', type=int, location='form', required=True)
    upload_parser.add_argument('name', type=str, location='form', required=True)
    upload_parser.add_argument('cm:description', type=str, location='form', required=True)
    


    @API.expect(upload_parser)
    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])
    def put(self):
        """New entry in cms repo with the new resource."""
        cms_repo_url = current_app.config.get("CMS_REPO_URL") 
        cms_repo_username =current_app.config.get("CMS_REPO_USERNAME")  
        cms_repo_password =current_app.config.get("CMS_REPO_PASSWORD") 
        # print(cms_repo_password)
        if cms_repo_url is None:
            return {
                "message": "CMS Repo Url is not configured"
            }, HTTPStatus.INTERNAL_SERVER_ERROR

       
        if "upload" not in request.files:
            return {"message": "No upload files in the request"}, HTTPStatus.BAD_REQUEST

        contentfile = request.files["upload"]
        filename = contentfile.filename
        file_content =  contentfile.read()
        files = {'file': (filename, file_content)}
        request_data = request.form.to_dict(flat=True)
        params = {
            # "majorVersion" : request_data["majorVersion"],
            # "comment" :request_data["comment"],
            "name" :request_data["name"],
            "cm:description" : request_data["cm:description"]
            
        }
        headers = {}
        headers["Content-Type"] = ""
        if filename != "":
            try:
                docData = DocManageService.fetchDocId(request_data["id"])
                if docData['status']=="success":
                    docId=docData['documentId']
                    url = cms_repo_url + "1/nodes/" + docId + '/content'
                    document = requests.put(
                        url,files=files,params=params,headers = headers,auth=HTTPBasicAuth(cms_repo_username, cms_repo_password)
                    )
                    response = json.loads(document.text)
                    if document.ok:
                        formatted_document = DMSConnector.doc_update_connector(response,DMSCode.DMS01.value)
                        uploadeddata = DocManageService.doc_update_mutation(request_data["id"],formatted_document)
                        print("Upload completed successfully!")
                        return (
                            (
                                {  
                                    "objectId": response['entry']['id'],
                                    "name": response['entry']['name'],
                                    
                                }
                            ),
                            HTTPStatus.OK,
                        )
                    else:
                        print("Something went wrong!")
                    print(document)
                    return (
                        (document
                        ),
                        HTTPStatus.OK,
                    )
            except Exception as e:
                    return {
                        "message": "Unable to  upload files in the request", "error" : e.message
                    }, HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            return {"message": "No upload files in the request"}, HTTPStatus.BAD_REQUEST
       


@cors_preflight("GET,POST,OPTIONS")
@API.route("/download", methods=["GET", "OPTIONS"])
class CMISConnectorDownloadResource(Resource):
    """Resource for downloading files from cms repo."""

    @API.doc(params={'id': {'description': 'Enter the  Document ID here :',
                            'type': 'int', 'default': 1}})

    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])
    def get(self):
        """Getting resource from cms repo."""
        cms_repo_url = current_app.config.get("CMS_REPO_URL")
        cms_repo_username = current_app.config.get("CMS_REPO_USERNAME")
        cms_repo_password = current_app.config.get("CMS_REPO_PASSWORD")
        if cms_repo_url is None:
            return {
                "message": "CMS Repo Url is not configured"
            }, HTTPStatus.INTERNAL_SERVER_ERROR

        
        args = request.args
        documentId = args.get("id")
        try:
            docData = DocManageService.fetchDocId(documentId)
            if docData['status']=="success":
                docId=docData['documentId']
                doc_name = str(docData['name'])
                prepare_url = cms_repo_url + "1/nodes/"+docId+"/content?attachment=true"
                final_document = requests.get(
                        prepare_url, auth=HTTPBasicAuth(cms_repo_username, cms_repo_password)
                    )
                
                return Response(final_document.content,mimetype=((final_document.headers['content-type']).split(";"))[0],headers= {"file_name" :doc_name,"Content-Disposition": "attachment","content_type" : docData["contenttype"]})
                # return send_file(final_document.content,mimetype=((final_document.headers['content-type']).split(";"))[0],attachment_filename=doc_name, as_attachment=True)
            else:
                 return {"message": "No file data found in DB"}, HTTPStatus.INTERNAL_SERVER_ERROR   
        except Exception as e:
                return {
                    "message": "Unable to  upload files in the request", "error" : e.message
                }, HTTPStatus.INTERNAL_SERVER_ERROR
