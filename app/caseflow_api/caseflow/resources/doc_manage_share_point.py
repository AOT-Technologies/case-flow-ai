"""API endpoints for managing share point."""
from http import HTTPStatus
import json
from flask import current_app, request, make_response, Response
from flask_restx import Namespace, Resource, reqparse
from caseflow.services import DocManageService
from caseflow.utils import auth, cors_preflight
from caseflow.resources.share_point_helper import SharePoint
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode
from werkzeug.datastructures import FileStorage


# keeping the base path same for share point

API = Namespace("CMIS_SHAREPOINT", description="CMIS SharePoint Connector")

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
    def post(self):

        args = self.upload_parser.parse_args()
        SHAREPOINT_FOLDER_NAME  = current_app.config.get("SHAREPOINT_FOLDER_NAME")   
        document_details = SharePoint.format_document_details(args)
        try:
            return SharePoint.file_upload_sharepoint(SHAREPOINT_FOLDER_NAME,document_details)
        except Exception as e:
            return {
                "message": "Unable to  upload files in the request", "error" : e.message
            }, HTTPStatus.INTERNAL_SERVER_ERROR



@cors_preflight("GET,POST,OPTIONS,PUT")
@API.route("/update", methods=["PUT", "OPTIONS"])
class CMISConnectorUploadResource(Resource):
    """Resource for uploading  share point"""

    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('upload', location='files',type=FileStorage, required=True)
    upload_parser.add_argument('id', type=int, location='form', required=True)

    @API.expect(upload_parser)
    @auth.require
    def put(self):
        args = self.upload_parser.parse_args()

        if "upload" not in args:
            return {"message": "No upload files in the request"}, HTTPStatus.BAD_REQUEST

        content_file = request.files["upload"]
        filename = content_file.filename
        data =content_file.read()    
        request_data = request.form.to_dict(flat=True)
        if filename != "":
            try:
                document = SharePoint().update_file(filename,data)
                if document.exists:
                    response = document.properties
                    formatted_document = DMSConnector.doc_update_connector(response,DMSCode.DMS03.value)
                    uploaded_data = DocManageService.doc_update_mutation(request_data["id"],formatted_document)
                    print("Upload completed successfully!")
                    if uploaded_data['status']=="success":
                        return (
                            (uploaded_data),HTTPStatus.OK,
                        )
                    else:
                        document = SharePoint().delete_file(document.serverRelativeUrl)
                        document_content = document.json()
                        print(document_content)
                else:
                    print("Something went wrong!")

            except Exception as e:
                return {
                    "message": "Unable to  upload files in the request", "error" : e.message
                }, HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            return {"message": "Unable to  upload files in the request"}, HTTPStatus.BAD_REQUEST


@cors_preflight("GET,POST,OPTIONS")
@API.route("/download", methods=["GET", "OPTIONS"])
class CMISConnectorDownloadResource(Resource):
    """Resource for downloading files from share point"""

    @auth.require
    @API.doc(params={'id': {'description': 'Enter the  Document ID here :',
                            'type': 'int', 'default': 1}})
    def get(self):
        """Getting resource from share point"""

        args = request.args
        documentId = args.get("id")
        try:
            doc_data = DocManageService.fetchDocId(documentId)
            if doc_data['status']=="success":                
                doc_download_url=doc_data['doc_download_url']                
                final_document = SharePoint().download_file(doc_download_url)
                return Response(final_document.content,mimetype='application/octet-stream',headers= {"file_name" :doc_data['name'],"content_type" : doc_data["contenttype"]    })
                # return send_file(document,attachment_filename='capsule.zip', as_attachment=True),HTTPStatus.OK,
            else:
                return {"message": "No file data found in DB"}, HTTPStatus.INTERNAL_SERVER_ERROR
        except Exception as e:
            return {
                "message": "Unable to  upload files in the request", "error" : e.message
            }, HTTPStatus.INTERNAL_SERVER_ERROR