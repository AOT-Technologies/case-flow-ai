

from http import HTTPStatus
from flask import current_app, request
from caseflow.resources.s3_helper import file_upload_s3
from caseflow.resources.share_point_helper import SharePoint
from caseflow.resources.alfresco_helper import AlfrescoHelper
from caseflow.resources.share_point_helper import SharePoint
from caseflow.services.doc_manage import DocManageService


class CaseManageHelper :

    @staticmethod
    def validate_new_case(args) :
        if "upload" not in args:
            return {"message": "No upload files in the request"}, HTTPStatus.BAD_REQUEST
        if "name" not in args:
            return {"message": "No name  in the request"}, HTTPStatus.BAD_REQUEST
        if "description" not in args:
            return {"message": "No description  in the request"}, HTTPStatus.BAD_REQUEST
        return True

    @staticmethod
    def format_data_from_args_new_case(args) :
        content_file = args["upload"]
        file_name = content_file.filename
        data = content_file.read()
        
        return {
            
            "name" : args['name'],
            "description" : args["description"],
            "document_details" : {
                "doc_description" : args["doc_description"],
                "doc_name" : args["doc_name"],
                "content_file" : content_file,
                "file_name" : file_name,
                "data" : data,
            }
            
        }

    @staticmethod
    def new_case_document_upload_s3(caseDetails, caseID):
        bucket_name = current_app.config.get("S3_BUCKET_NAME")
        access_level = current_app.config.get("S3_DEFAULT_PERMISSION")
        uploaded_case_file = file_upload_s3(bucket_name, access_level, caseDetails["document_details"], caseID)
        if uploaded_case_file['status'] == "success" :
            return True
        else :
            return False

    @staticmethod
    def new_case_document_upload_alfresco(caseDetails, caseID):
        cms_repo_url = current_app.config.get("CMS_REPO_URL")
        cms_repo_username = current_app.config.get("CMS_REPO_USERNAME")
        cms_repo_password = current_app.config.get("CMS_REPO_PASSWORD")
        cms_repo_folder_name = current_app.config.get("CMS_REPO_FOLDER_NAME")
        url = cms_repo_url + "1/nodes/-root-/children"
        data = AlfrescoHelper.format_data(caseDetails,cms_repo_folder_name)
        uploaded_case_file = AlfrescoHelper.file_upload_alfresco(cms_repo_url, cms_repo_username, cms_repo_password, url, data, caseID)
        if uploaded_case_file['status'] == "success" :
            return True
        else :
            return False

    @staticmethod
    def new_case_document_upload_sharepoint(caseDetails, caseID):
        SHAREPOINT_FOLDER_NAME = current_app.config.get("SHAREPOINT_FOLDER_NAME")

        uploaded_case_file = SharePoint.file_upload_sharepoint(SHAREPOINT_FOLDER_NAME, caseDetails["document_details"], caseID)
        if uploaded_case_file['status'] == "success" :
            return True
        else :
            return False

class CaseManageResulthelper :

    @staticmethod
    def case_delete_error_message():
        return {"message": "Failed to delete case",
            "status": "error"}, HTTPStatus.INTERNAL_SERVER_ERROR
    
    @staticmethod
    def case_delete_sucess_message(delete_case):
        return {"message": "case is deleted sucessfully",
                "data" : delete_case['message']['data'],
                "status": "success"}, HTTPStatus.OK

    


