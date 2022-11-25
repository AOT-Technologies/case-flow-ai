from http import HTTPStatus
from flask import  request
from caseflow.services import DocManageService
from caseflow.resources.s3_helper import upload_object,delete_object
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode




class DocUploadService:
    """This class manages doc service"""
    @staticmethod
    def file_upload_s3(bucket_name,access_level,data,file_name,content_file,args):
                data = upload_object(bucket_name,access_level,data,file_name)
                response = data.get('response')
                if response.get('HTTPStatusCode') == 200:
                    file_data = data.get('object')
                    formatted_document = DMSConnector.doc_upload_connector(file_data,DMSCode.DMS02.value)
                    formatted_document["doc_type"] =  content_file.content_type
                    formatted_document["doc_description"] =  args.get('cm:description')
                    uploaded_data = DocManageService.doc_upload_mutation(request,formatted_document)
                    print("Upload completed successfully!")
                    if uploaded_data['status']=="success":
                        return (
                            (uploaded_data),HTTPStatus.OK,
                        )
                    else:
                        response = delete_object(bucket_name,file_name)
                        return( (uploaded_data),HTTPStatus.INTERNAL_SERVER_ERROR )
                else:
                    print("Something went wrong!")



