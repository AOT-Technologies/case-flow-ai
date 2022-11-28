from datetime import datetime
from typing import Dict
from dateutil import parser
from caseflow.utils.enums import DMSCode


class Sharepoint:
    """This class manages the connecton of Sharepoint system with the API"""
    @staticmethod
    def doc_upload(document) -> Dict:
        try :
            #once the sharepoint is configured enter the connector code here
            doc_modified_date = document["TimeLastModified"]
            doc_created_date = document["TimeCreated"]            
            doc_modified_date_utc = parser.parse(doc_modified_date)
            doc_created_date_utc = parser.parse(doc_created_date)
            formatted_document = {
                "doc_id" : document["UniqueId"],
                "doc_name" :document["Name"],
                "doc_dmsname" : document["Name"],
                "doc_type" :document["doc_type"],
                "doc_size" :document["Length"],
                "doc_description" :document["doc_description"],
                "version" :document["UIVersionLabel"],
                "doc_modified" :doc_modified_date_utc.strftime("%Y-%m-%dT%H:%M:%S"),
                "doc_created" :doc_created_date_utc.strftime("%Y-%m-%dT%H:%M:%S"),
                "doc_download_url":document["ServerRelativeUrl"],
                "dms_provider" : DMSCode.DMS03.value
            }


            return formatted_document

        except Exception as error:
            print('doc_upload failed to run :' + repr(error))
    
    @staticmethod
    def doc_update(document) -> Dict:
        try :
            doc_modified_date = document["TimeLastModified"]                       
            doc_modified_date_utc = parser.parse(doc_modified_date)            
            formatted_document = {                
                "doc_name" :document["Name"],
                "doc_type" :"",
                "doc_size" :document["Length"],
                "doc_description" :"",
                "version" :document["UIVersionLabel"],
                "doc_modified" :doc_modified_date_utc.strftime("%Y-%m-%dT%H:%M:%S"),
                "doc_download_url":document["ServerRelativeUrl"]
            }

            return formatted_document

        except Exception as error:
            print('doc_update failed to run :' + repr(error))
