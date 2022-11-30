"""API endpoints for managing cms repo."""

from http import HTTPStatus
from flask_restx import Namespace, Resource, reqparse
from caseflow.utils import auth,   cors_preflight
from caseflow.services import CaseManageService
from werkzeug.datastructures import FileStorage
from caseflow.utils.enums import DMSCode
from caseflow.resources.case_manage_helper import CaseManageHelper,CaseManageResulthelper
from caseflow.utils.enums import CaseflowRoles



# keeping the base path same for case management operations

API = Namespace("CASE", description="CRED Operations of a case")


@cors_preflight("POST,OPTIONS")
@API.route("/upload", methods=["POST", "OPTIONS"])
class CaseManagementUploadResource(Resource):
    """Resource for CRED operations on cases"""
    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('upload', location='files', type=FileStorage, required=True)
    upload_parser.add_argument('name', type=str, location='form', required=True)
    upload_parser.add_argument('description', type=str, location='form', required=True)
    upload_parser.add_argument('doc_description', type=str, location='form', required=True)
    upload_parser.add_argument('doc_name', type=str, location='form', required=True)
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
                        result = CaseManageHelper.new_case_document_upload_alfresco(caseDetails, caseID)

                    elif DMS == DMSCode.DMS02.value :
                        result = CaseManageHelper.new_case_document_upload_s3(caseDetails, caseID)

                    elif DMS == DMSCode.DMS03.value :
                        result = CaseManageHelper.new_case_document_upload_sharepoint(caseDetails, caseID)

                    else :
                        raise Exception('select a valid DMS')

                    if result :
                        return {"message": "New case is added successfully",
                                "data" : uploaded_case_data['message']['data'],
                                "status": "success"}, HTTPStatus.CREATED
                    else :
                        deleted_case = CaseManageService.delete_case(caseID)
                        return {"message": "failed to add new case",
                                "status": "error"}, HTTPStatus.INTERNAL_SERVER_ERROR



            else :
                return validated

        except Exception as e:
            return {
                "message": "Unable to add new case", "error" : e
            }, HTTPStatus.INTERNAL_SERVER_ERROR


@cors_preflight("DELETE,OPTIONS")
@API.route("/delete", methods=["DELETE", "OPTIONS"])
class CaseManagementUploadResource(Resource):
    upload_parser = reqparse.RequestParser()
    upload_parser.add_argument('Id', type=str, location='form', required=True)

    @API.expect(upload_parser)
    @auth.require
    @auth.has_role([CaseflowRoles.CASEFLOW_ADMINISTRATOR.value])
    def delete(self):
        args = self.upload_parser.parse_args()

        try:
            Id = args.get("Id")
            delete_case = CaseManageService.delete_case(Id)
            if delete_case["status"] == "success" :
                result = CaseManageService.delete_case_documents(Id)
                if result['status'] :
                    return CaseManageResulthelper.case_delete_sucess_message(delete_case)
                else :
                    delete_case = CaseManageService.delete_case(Id, False)
                    return CaseManageResulthelper.case_delete_error_message()
            else :
                return CaseManageResulthelper.case_delete_error_message()

        except Exception as e:
            return {
                "message": "Unable to  delete the case ", "error" : e
            }, HTTPStatus.INTERNAL_SERVER_ERROR
