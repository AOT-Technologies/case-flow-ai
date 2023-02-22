import { BadRequestException, Injectable } from '@nestjs/common';

//_____________________Custom Imports_____________________//
import { AmazonS3Service } from './amazon-s3.service';
import { AlfrescoService } from './alfresco.service';
import { SharepointServices } from './sharepoint.service';

@Injectable()
export class FileService {
  constructor(private readonly s3Service: AmazonS3Service,private readonly alfrescoService: AlfrescoService,private readonly spService:SharepointServices) {}

  // Summary : Upload File to crespective DMS 
  // Created By : Don C Varghese
  async uploadFile(file, data, dms,token=null) {
    try{
    switch (dms) {
      case '1': {
        return await this.s3Service.uploadDocument(file, data?.name);
      }
      case '2': {
        return await this.spService.uploadDocument(file, data?.name);
      }
      case '3': {
        return await this.alfrescoService.uploadDocument(file, data,token);
      }
    }
  } catch (err) {
    throw new BadRequestException("Issue in the doc upload")
  }
  }

  // Summary : Update File to respective DMS 
  // Created By : Don C Varghese
  async updateFile(file, data,document, dms,token=null) {
    try{
    switch (dms) {
      case '1': {
        return await this.s3Service.uploadDocument(file, data?.name);
      }
      case '2': {
        return await this.spService.uploadDocument(file, data?.name);
      }
      case '3': {
        return await this.alfrescoService.updateDocument(file,document, data,token);
      }
    }
  } catch (err) {
    throw new BadRequestException("Issue in the doc upload")
  }
  }

   // Summary : Download file from respective DMS 
  // Created By : Don Basil
  async downloadFile(documentId, dms,token=null) {
    try{
    switch (dms) {
      case 1: {
        return await this.s3Service.getDocument(documentId);
      }
      case 2: {
        return await this.spService.getDocument(documentId);
      }
      case 3: {
        return await this.alfrescoService.getDocument(documentId,token);
      }
    }
  } catch (err) {
    throw new BadRequestException("Issue in the doc upload")
  }
  }

  // Summary : delete file from respective DMS 
  // Created By : Don Basil
  async deleteFile(document, dms,token=null) {
    try{
    switch (dms) {
      case 1: {
        return await this.s3Service.deleteDocument(document?.documentref);
      }
      case 2: {
        return await this.spService.deleteDocument(document?.name);
      }
      case 3: {
        return await this.alfrescoService.deleteDocument(document?.documentref,token);
      }
    }
  } catch (err) {
    throw new BadRequestException("Issue in the doc upload")
  }
  }
  
}
