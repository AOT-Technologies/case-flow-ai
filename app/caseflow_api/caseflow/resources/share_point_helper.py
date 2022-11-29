
from office365.sharepoint.client_context import ClientContext
from office365.runtime.auth.user_credential import UserCredential
from office365.sharepoint.files.file import File
import datetime
import os
from caseflow.services import DocManageService
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode
from flask import request


# SHARE_POINT
USERNAME = os.getenv("SHAREPOINT_USERNAME")
PASSWORD = os.getenv("SHAREPOINT_PASSWORD")
SHAREPOINT_FOLDER_NAME = os.getenv("SHAREPOINT_FOLDER_NAME")
SHAREPOINT_SITE = os.getenv("SHAREPOINT_SITE")
SHAREPOINT_SITE_NAME = os.getenv("SHAREPOINT_SITE_NAME")
SHAREPOINT_DOC = os.getenv("SHAREPOINT_DOC")


class SharePoint:

    @classmethod
    def _auth(self):
        try:
            conn = ClientContext(SHAREPOINT_SITE).with_credentials(
                UserCredential(
                    USERNAME,
                    PASSWORD
                )
            )
        except Exception as e:
            print(e)
        return conn

    @classmethod
    def _get_files_list(self, folder_name):

        conn = self._auth()
        target_folder_url = f'{SHAREPOINT_DOC}/{folder_name}'
        root_folder = conn.web.get_folder_by_server_relative_url(target_folder_url)
        root_folder.expand(["Files", "Folders"]).get().execute_query()
        return root_folder.files

    @classmethod
    def download_file(self, file_url):
        conn = self._auth()
        file = File.open_binary(conn, file_url)
        return file

    @classmethod
    def download_latest_file(self, folder_name):
        date_format = "%Y-%m-%dT%H:%M:%SZ"
        files_list = self._get_files_list(folder_name)
        file_dict = {}
        for file in files_list:
            dt_obj = datetime.datetime.strptime(file.time_last_modified, date_format)
            file_dict[file.name] = dt_obj
        # sort dict object to get the latest file
        file_dict_sorted = {key: value for key, value in sorted(file_dict.items(), key=lambda item: item[1], reverse=True)}
        latest_file_name = next(iter(file_dict_sorted))
        content = self.download_file(latest_file_name, folder_name)
        return latest_file_name, content

    @classmethod
    def upload_file(self, file_name, folder_name, content):
        conn = self._auth()
        target_folder_url = f'/sites/{SHAREPOINT_SITE_NAME}/{SHAREPOINT_DOC}/{folder_name}'
        target_folder = conn.web.get_folder_by_server_relative_path(target_folder_url)
        response = target_folder.upload_file(file_name, content).execute_query()
        return response

    @classmethod
    def delete_file(self, file_url):
        conn = self._auth()
        file = conn.web.get_file_by_server_relative_url(file_url)
        response = file.delete_object().execute_query()
        return response

    @classmethod
    def update_file(self, name, file_content):
        conn = self._auth()
        target_folder_url = f'/sites/{SHAREPOINT_SITE_NAME}/{SHAREPOINT_DOC}/{SHAREPOINT_FOLDER_NAME}'
        target_folder = conn.web.get_folder_by_server_relative_path(target_folder_url)
        response = target_folder.upload_file(name, file_content).execute_query()
        return response

    @classmethod
    def upload_file_in_chunks(self, file_path, folder_name, chunk_size, chunk_uploaded=None, **kwargs):
        conn = self._auth()
        target_folder_url = f'/sites/{SHAREPOINT_SITE_NAME}/{SHAREPOINT_DOC}/{folder_name}'
        target_folder = conn.web.get_folder_by_server_relative_path(target_folder_url)
        response = target_folder.files.create_upload_session(
            source_path=file_path,
            chunk_size=chunk_size,
            chunk_uploaded=chunk_uploaded,
            **kwargs
        ).execute_query()
        return response

    @classmethod
    def get_list(self, list_name):
        conn = self._auth()
        target_list = conn.web.lists.get_by_title(list_name)
        items = target_list.items.get().execute_query()
        return items

    @classmethod
    def get_file_properties_from_folder(self, folder_name):
        files_list = self._get_files_list(folder_name)
        properties_list = []
        for file in files_list:
            file_dict = {
                'file_id': file.unique_id,
                'file_name': file.name,
                'major_version': file.major_version,
                'minor_version': file.minor_version,
                'file_size': file.length,
                'time_created': file.time_created,
                'time_last_modified': file.time_last_modified
            }
            properties_list.append(file_dict)
            file_dict = {}
        return properties_list

    @classmethod
    def file_upload_sharepoint(self, SHAREPOINT_FOLDER_NAME, document_details, caseID="null"):
        document = self.upload_file(document_details["doc_name"], SHAREPOINT_FOLDER_NAME, document_details["data"])
        if document.exists:
            response = document.properties
            file_url = document.serverRelativeUrl
            response["doc_type"] = (document_details["content_file"]).content_type
            response["doc_description"] = document_details["doc_description"]
            formatted_document = DMSConnector.doc_upload_connector(response, DMSCode.DMS03.value)
            uploaded_data = DocManageService.doc_upload_mutation(request, formatted_document, caseID)
            print("Upload completed successfully!")
            if uploaded_data['status'] == "success":
                return uploaded_data

            else:
                document = SharePoint().delete_file(file_url)
                return uploaded_data

        else:
            print("Something went wrong!")
            
    @staticmethod
    def format_document_details(args):
        content_file = args["upload"]
        file_name = args["name"]
        data =content_file.read()
        return {
                    "doc_description" : args["description"],
                    "doc_name" : args["name"],
                    "content_file" : content_file,
                    "file_name" : file_name,
                    "data" : data,
                }
