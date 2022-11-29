"""API endpoints for managing s3 bucket."""

from http import HTTPStatus
import json
from flask import current_app, request,make_response,Response
from flask_restx import Namespace, Resource,reqparse
from caseflow.services import DocManageService
from caseflow.resources.s3_helper import get_object,delete_object,update_object,file_upload_s3, format_document_details
from caseflow.utils import auth, cors_preflight
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode
from werkzeug.datastructures import FileStorage

# keeping the base path same for S3 operations 

API = Namespace("CMIS_S3", description="CMIS S3 Connector")


@cors_preflight("GET,POST,OPTIONS")
@API.route("/upload", methods=["POST", "OPTIONS"])
class CMISConnectorUploadResource(Resource):
    """Resource for uploading S3 bucket"""

    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('upload', location='files',type=FileStorage, required=True)
    upload_parser.add_argument('name', type=str, location='form', required=True)
    upload_parser.add_argument('description', type=str, location='form', required=True)    
    @API.expect(upload_parser)
    @auth.require
    def post(self):
        args = self.upload_parser.parse_args()

        bucket_name = current_app.config.get("S3_BUCKET_NAME")
        access_level = current_app.config.get("S3_DEFAULT_PERMISSION")
        document_details = format_document_details(args)
        try:
            return file_upload_s3(bucket_name,access_level,document_details)
            
        except Exception as e:
            return {
                "message": "Unable to  upload files in the request", "error" : e
            }, HTTPStatus.INTERNAL_SERVER_ERROR



@cors_preflight("GET,POST,OPTIONS,PUT")
@API.route("/update", methods=["PUT", "OPTIONS"])
class CMISConnectorUploadResource(Resource):
    """Resource for uploading S3 bucket"""

    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('upload', location='files',type=FileStorage, required=True)
    upload_parser.add_argument('id', type=int, location='form',required=True)

    @API.expect(upload_parser)
    @auth.require
    def put(self):

        args = self.upload_parser.parse_args()
        if "upload" not in args:
            return {"message": "No upload files in the request"}, HTTPStatus.BAD_REQUEST

        content_file = request.files["upload"]
        filename = content_file.filename
        data =content_file.read()
        bucket_name = current_app.config.get("S3_BUCKET_NAME")
        access_level = current_app.config.get("S3_DEFAULT_PERMISSION")
        request_data = request.form.to_dict(flat=True)
        if filename != "":
            try:
                docData = DocManageService.fetchDocId(args["id"])
                if docData and docData["documentId"] :
                    documentid = docData["documentId"]
                    data = update_object(bucket_name,access_level,data,documentid)
                    response = data.get('response')
                    if response.get('HTTPStatusCode') == 200:
                        file_data = data.get('object')
                        formatted_document = DMSConnector.doc_update_connector(file_data,DMSCode.DMS02.value)
                        uploaded_data = DocManageService.doc_update_mutation(args["id"],formatted_document)
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
                    "message": "Unable to  upload files in the request", "error" : e
                }, HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            return {"message": "Unable to  upload files in the request"}, HTTPStatus.BAD_REQUEST


@cors_preflight("GET,POST,OPTIONS")
@API.route("/download", methods=["GET", "OPTIONS"])
class CMISConnectorDownloadResource(Resource):
    """Resource for downloading files from S3 bucket"""

    @auth.require
    @API.doc(params={'id': {'description': 'Enter the  Document ID here :',
                            'type': 'int', 'default': 1}})
    def get(self):
        """Getting resource from s3 bucket"""

        args = request.args
        documentId = args.get("id")
        bucket_name = current_app.config.get("S3_BUCKET_NAME")
        try:
            doc_data = DocManageService.fetchDocId(documentId)
            if doc_data['status']=="success":
                doc_name=doc_data["documentId"]

                final_document = get_object(bucket_name,doc_name)
                return Response(final_document,mimetype='application/octet-stream',headers= {"file_name" :doc_name,"content_type" : doc_data["contenttype"] })
                # return send_file(document,attachment_filename='capsule.zip', as_attachment=True),HTTPStatus.OK,
            else:
                return {"message": "No file data found in DB"}, HTTPStatus.INTERNAL_SERVER_ERROR
        except Exception as e:
            return {
                "message": "Unable to  upload files in the request", "error" : e
            }, HTTPStatus.INTERNAL_SERVER_ERROR
