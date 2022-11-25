

from http import HTTPStatus
from flask import current_app,request
from caseflow.resources.s3_helper import file_upload_s3
import requests
from werkzeug.datastructures import MultiDict
from requests.auth import HTTPBasicAuth
import json
from caseflow.services import DocManageService
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode








class AlfrescoHelper :

    @staticmethod
    def file_upload_alfresco(cms_repo_url,cms_repo_username,cms_repo_password,url,data,caseID="null") :
        document = requests.post(
        url,data = data['form'],files= data['file'],auth=HTTPBasicAuth(cms_repo_username, cms_repo_password)
    )

        if document.ok:
            response = json.loads(document.text)
            formatted_document = DMSConnector.doc_upload_connector(response,DMSCode.DMS01.value)
            uploadeddata = DocManageService.doc_upload_mutation(request,formatted_document,caseID)
            if uploadeddata['status']=="success":
                return uploadeddata 
            else:
                url = cms_repo_url + "1/nodes/"+response['entry']['id']
                document = requests.delete(url,auth=HTTPBasicAuth(cms_repo_username, cms_repo_password))
                return uploadeddata
        else:
            print("Something went wrong!")

    @staticmethod
    def format_data(caseDetails) :
        file = {'filedata': caseDetails["content_file"]}
        form = MultiDict([('name', caseDetails['file_name']), ("nodeType", 'cm:content'),("cm:title", 'My text'),("cm:description", caseDetails["description"]),("relativePath", "Uploads")])
        return {"file" :file, "form": form}

           





