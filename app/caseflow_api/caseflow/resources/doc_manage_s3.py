"""API endpoints for managing cms repo."""
from email import header
import mimetypes
from http import HTTPStatus
import json
import requests
from cmislib.exceptions import UpdateConflictException
from flask import current_app, request,make_response,Response
from flask_restx import Namespace, Resource
from requests.auth import HTTPBasicAuth
from caseflow.services import DocManageService
from caseflow.resources.s3_helper import get_object,upload_object,delete_object,update_object
from caseflow.utils import auth, cors_preflight
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode
from caseflow.utils.enums import CaseflowRoles


# keeping the base path same for cmis operations (upload / download) as cmis/

API = Namespace("CMIS_S3", description="CMIS S3 Connector")


@cors_preflight("GET,POST,OPTIONS")
@API.route("/upload", methods=["POST", "OPTIONS"])
class CMISConnectorUploadResource(Resource):
    """Resource for uploading cms repo."""

    @staticmethod
    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])
    def post():
        
        if "upload" not in request.files:
            return {"message": "No upload files in the request"}, HTTPStatus.BAD_REQUEST

        content_file = request.files["upload"]
        file_name = content_file.filename
        data =content_file.read()
        bucket_name = current_app.config.get("S3_BUCKET_NAME") 
        access_level = current_app.config.get("S3_DEFAULT_PERMISSION") 
        if file_name != "":
            try:
                data = upload_object(bucket_name,access_level,data,file_name)
                response = data.get('response') 
                if response.get('HTTPStatusCode') == 200:
                    file_data = data.get('object')
                    formatted_document = DMSConnector.doc_upload_connector(file_data,DMSCode.DMS02.value)
                    uploaded_data = DocManageService.doc_upload_mutation(request,formatted_document)
                    print("Upload completed successfully!")
                    if uploaded_data['status']=="success":
                        return (
                            (uploaded_data),HTTPStatus.OK,
                        )
                    else:
            
                     response = delete_object(bucket_name,file_name)
                     document_content = response
                     print(document_content)
                else:
                    print("Something went wrong!")

            except Exception as e:
                return {
                    "message": "Unable to  upload files in the request", "error" : e.message
                }, HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            return {"message": "Unable to  upload files in the request"}, HTTPStatus.BAD_REQUEST

            
 
        

@cors_preflight("GET,POST,OPTIONS,PUT")
@API.route("/update", methods=["PUT", "OPTIONS"])
class CMISConnectorUploadResource(Resource):
    """Resource for uploading cms repo."""

    @staticmethod
    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])

    def put():       
        if "upload" not in request.files:
            return {"message": "No upload files in the request"}, HTTPStatus.BAD_REQUEST

        content_file = request.files["upload"]
        filename = content_file.filename
        data =content_file.read()
        bucket_name = current_app.config.get("S3_BUCKET_NAME") 
        access_level = current_app.config.get("S3_DEFAULT_PERMISSION") 
        request_data = request.form.to_dict(flat=True)
        if filename != "":
            try:
                docData = DocManageService.fetchDocId(request_data["id"])
                if docData and docData["documentId"] :
                    documentid = docData["documentId"]
                    data = update_object(bucket_name,access_level,data,documentid)
                    response = data.get('response') 
                    if response.get('HTTPStatusCode') == 200:
                        file_data = data.get('object')
                        formatted_document = DMSConnector.doc_update_connector(file_data,DMSCode.DMS02.value)
                        uploaded_data = DocManageService.doc_update_mutation(request_data["id"],formatted_document)
                        print("Upload completed successfully!")
                        if uploaded_data['status']=="success":
                            return (
                                (uploaded_data),HTTPStatus.OK,
                            )
                        else:
                            data = delete_object(bucket_name,filename)
                            document_content = data.json()
                            print(document_content)
                    else:
                        return {
                        "message": "Unable to  upload files in the request", "error" : "Unable to save document detals"
                        }, HTTPStatus.INTERNAL_SERVER_ERROR
                else: 
                    return {
                    "message": "Unable to  upload files in the request", "error" : "Unable to find the document Id"
                }, HTTPStatus.INTERNAL_SERVER_ERROR

            except Exception as e:
                return {
                    "message": "Unable to  upload files in the request", "error" : e.message
                }, HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            return {"message": "Unable to  upload files in the request"}, HTTPStatus.BAD_REQUEST

      


@cors_preflight("GET,POST,OPTIONS")
@API.route("/download", methods=["GET", "OPTIONS"])
class CMISConnectorDownloadResource(Resource):
    """Resource for downloading files from cms repo."""

    @staticmethod
    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])
    def get():
        """Getting resource from cms repo."""
        
        args = request.args
        documentId = args.get("id")
        bucket_name = current_app.config.get("S3_BUCKET_NAME") 
        try:
            doc_data = DocManageService.fetchDocId(documentId)
            if doc_data['status']=="success":
                doc_name=doc_data["documentId"]
                
                final_document = get_object(bucket_name,doc_name)
                return Response(final_document,mimetype='application/octet-stream',headers= {"file_name" :doc_name })
                # return send_file(document,attachment_filename='capsule.zip', as_attachment=True),HTTPStatus.OK,
            else:
                 return {"message": "No file data found in DB"}, HTTPStatus.INTERNAL_SERVER_ERROR   
        except Exception as e:
                return {
                    "message": "Unable to  upload files in the request", "error" : e
                }, HTTPStatus.INTERNAL_SERVER_ERROR
