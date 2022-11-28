"""API endpoints for managing cms repo."""

from http import HTTPStatus
from flask_restx import Namespace, Resource, reqparse
from caseflow.utils import auth, cors_preflight
from caseflow.utils.enums import CaseflowRoles
from caseflow.services import CaseManageService
from werkzeug.datastructures import FileStorage
from caseflow.utils.enums import DMSCode
from caseflow.resources.case_manage_helper import CaseManageHelper


# keeping the base path same for case management operations

API = Namespace("CASE", description="CRED Operations of a case")


@cors_preflight("GET,POST,PUT,DELETE,OPTIONS")
@API.route("/", methods=["POST", "PUT", "DELETE", "OPTIONS"])
class CaseManagementResource(Resource):
    """Resource for CRED operations on cases"""
    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('upload', location='files', type=FileStorage, required=True)
    upload_parser.add_argument('name', type=str, location='form', required=True)
    upload_parser.add_argument('description', type=str, location='form', required=True)
    upload_parser.add_argument('DMS', type=str, location='form', required=True)

    @API.expect(upload_parser)
    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])
    def post(self):
        args = self.upload_parser.parse_args()

        try:
            DMS = int(args["DMS"])
            validated = CaseManageHelper.validate_new_case(args)
            if validated == True:
                caseDetails = CaseManageHelper.format_data_from_args_new_case(args)
                uploaded_case_data = CaseManageService.create_new_case(caseDetails)
                if uploaded_case_data['status'] == "success" :
                    caseID = uploaded_case_data['message']['data']['insertCases']['id']

                    if DMS == DMSCode.DMS01.value :
                        result = CaseManageHelper.new_case_document_upload_alfresco(caseDetails, args, caseID)

                    elif DMS == DMSCode.DMS02.value :
                        result = CaseManageHelper.new_case_document_upload_s3(caseDetails, caseID)

                    elif DMS == DMSCode.DMS03.value :
                        result = CaseManageHelper.new_case_document_upload_sharepoint(caseDetails, caseID)

                    else :
                        raise Exception('select a valid DMS')

                    if result :
                        return {"message": "New case is added successfully",
                                "status": "success"}, HTTPStatus.OK

            else :
                return validated

        except Exception as e:
            return {
                "message": "Unable to upload files in the request", "error" : e
            }, HTTPStatus.INTERNAL_SERVER_ERROR

    def put():
        try:
            s = ''
        except Exception as e:
            return {
                "message": "Unable to  update the details", "error" : e
            }, HTTPStatus.INTERNAL_SERVER_ERROR

    def delete():
        try:
            s = ''
        except Exception as e:
            return {
                "message": "Unable to  delete the case ", "error" : e
            }, HTTPStatus.INTERNAL_SERVER_ERROR
