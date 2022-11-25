import boto3
from botocore.exceptions import ClientError
from flask import current_app
import uuid;
from http import HTTPStatus
from flask import  request
from caseflow.services import DocManageService
from caseflow.services import DMSConnector
from caseflow.utils.enums import DMSCode

def create_bucket(bucket_name):
    """create s3 bucket."""
    try :
     session = boto3.Session(
         aws_access_key_id=current_app.config.get("AWS_ACCESS_KEY_ID")  ,
         aws_secret_access_key=current_app.config.get("AWS_SECRET_ACCESS_KEY") ,
         region_name=current_app.config.get("AWS_REGION_NAME") ,
     )
     s3 = session.resource('s3')
     response = s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={
         'LocationConstraint': current_app.config.get("AWS_REGION_NAME")})
     return response

    except Exception as e:
        return e


def upload_object(bucket_name, privacy_policy, data, file_name):
    """ Upload object to s3 bucket ."""
    try :
     s3_file_name = str(uuid.uuid4()) + "_"+ file_name
     is_exists = check_bucket(bucket_name)
     if is_exists is False :
        bucket = create_bucket(bucket_name)
     session = create_aws_session()
     s3 = session.resource('s3')
     try:
         s3.Object(bucket_name, s3_file_name).load()
     except ClientError as e:
          if e.response['Error']['Code'] == "404":
                object = s3.Object(bucket_name, s3_file_name)
                # object.set_metadata('name',file_name)
                # Privacy policy 'private'|'public-read'|'public-read-write'|'authenticated-read'|'aws-exec-read'|'bucket-owner-read'|'bucket-owner-full-control'
                result = object.put(Body=data,Metadata ={'name':file_name})

                res = result.get('ResponseMetadata')

                if res.get('HTTPStatusCode') == 200:
                    return {"response" : res,"object" : object }
                else:
                    return {"response" : res,"object" : object }
          else:
            return {"HTTPStatusCode" : "201", "message" : "Object already exist"}
     else:
           return {"HTTPStatusCode" : "201", "message" : "Object already exist"}
    except Exception as e:
        return e


def update_object(bucket_name, privacy_policy, data, file_name):
    """ Update Object n s3"""
    try :
     session = create_aws_session()
     s3 = session.resource('s3')
     object = s3.Object(bucket_name, file_name)
     # Privacy policy 'private'|'public-read'|'public-read-write'|'authenticated-read'|'aws-exec-read'|'bucket-owner-read'|'bucket-owner-full-control'
     result = object.put(Body=data)

     res = result.get('ResponseMetadata')

     if res.get('HTTPStatusCode') == 200:
        return {"response" : res,"object" : object }
     else:
       return {"response" : res,"object" : object }

    except Exception as e:
        return e


def delete_object(bucket_name, file_name):
    """Delete Object in S3."""
    try :
     session = create_aws_session()
     s3 = session.resource('s3')
     object = s3.Object(bucket_name, file_name)
     result = object.delete()
     res = result.get('ResponseMetadata')

     if res.get('HTTPStatusCode') == 204:
        return res
     else:
       return res

    except Exception as e:
        return e


def get_object(bucket_name, file_name):
    """Fetch object in S3 ."""
    try :
     session = create_aws_session()
     s3 = session.resource('s3')
     response = s3.Object(bucket_name, file_name).get()
     return response['Body'].read()

    except Exception as e:
        return e


def check_bucket(bucket_name):
    """ Check the bucket status in S3 ."""
    try :
        session = create_aws_session()
        s3 = session.resource('s3')
        try :
            s3.head_bucket(
                Bucket=bucket_name,
            )
            exists = True
            return exists
        except ClientError as error:
            error_code = int(error.response['Error']['Code'])
            if error_code == 403:
                print("Private Bucket. Forbidden Access! ", bucket_name)
            elif error_code == 404:
                print("Bucket Does Not Exist!", bucket_name)
            exists = False
            return exists

    except Exception as e:
        return e
# To create default session:


def create_aws_session():
    session = boto3.Session(
         aws_access_key_id=current_app.config.get("AWS_ACCESS_KEY_ID")  ,
         aws_secret_access_key=current_app.config.get("AWS_SECRET_ACCESS_KEY") ,
         region_name=current_app.config.get("AWS_REGION_NAME") ,
    )
    return session


def file_upload_s3(bucket_name,access_level,data,file_name,content_file,args,caseID="null"):
            data = upload_object(bucket_name,access_level,data,file_name)
            response = data.get('response')
            if response.get('HTTPStatusCode') == 200:
                file_data = data.get('object')
                formatted_document = DMSConnector.doc_upload_connector(file_data,DMSCode.DMS02.value)
                formatted_document["doc_type"] =  content_file.content_type
                formatted_document["doc_description"] =  args.get('description')
                uploaded_data = DocManageService.doc_upload_mutation(request,formatted_document,caseID)
                print("Upload completed successfully!")
                if uploaded_data['status']=="success":
                    return uploaded_data
                    
                else:
                    response = delete_object(bucket_name,file_name)
                    return uploaded_data
            else:
                print("Something went wrong!")
