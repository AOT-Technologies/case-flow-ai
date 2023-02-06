import { Body,Headers , Controller, Post, UploadedFile, UseInterceptors,Delete, Get, Patch,NotFoundException, Put, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

//_____________________Custom Imports_____________________//
import { FileService } from '../helpers/file.service';

import { DocumentsService } from './services/documents.service';
import { Express } from 'express';
import { TransformService } from '../helpers/transform.service';
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly fileService: FileService,
    private helper: TransformService,
    private documentService: DocumentsService,
  ) {}

  //for upload documents

  @Post('/uploadDocument')
   @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,@Body() body,@Headers () auth) {
      try {
      if(body && body?.dmsprovider && auth?.authorization){    
        const documentDetails = await this.fileService.uploadFile(file, body, body?.dmsprovider,auth?.authorization);
        const formattedDocument: any = await this.helper.transform(body?.dmsprovider,'CREATE',documentDetails,body);
        return this.documentService.createDocument(formattedDocument);
      }
      else{
        console.log("Request body/header Not provided");
      }
  } catch (err) {
    console.log(err.message);
  }
  }

  @Put()
  @MessagePattern({ cmd: 'edit_document' })
  async editDocument(data) {
    try {
      const document = await this.documentService.findOne(parseInt(data.id));
 
      if(!document.isdeleted) {
        let documentDetails = await (data.file && document && data.dmsprovider
          ? this.fileService.updateFile(data.file, data,document, data.dmsprovider,)
          : null);
        let formattedDocument: any = this.helper.transform(
          data?.dmsprovider,
          'UPDATE',
          documentDetails,
          data,
        );
        console.log('document', formattedDocument);
        return this.documentService.update(data.id, document);
      }
      else {
        return new NotFoundException("No file found to update")
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  @Get()
  @MessagePattern({ cmd: 'fetch_document' })
  async fetchDocument(param) {
    const token=param.authorization;
    try {   
      let doc_id = null;
      let documentDetails = await this.documentService.findOne(parseInt(param.id));
      let dms = await documentDetails.dmsprovider;
      if(dms===2){
         doc_id = await (
          documentDetails
        ).name;
      }   else{
        doc_id = await (
          documentDetails
        ).documentref;
      }  
      const data = await this.fileService.downloadFile(doc_id, dms,token);
      return {data : data , type : documentDetails.type,name : documentDetails.name,dmsprovider : documentDetails.dmsprovider}
    } catch (error) {
      console.log(error.message);
    }
  }

  // for delete documents
  @Post('/deleteDocument')
  @UseInterceptors(FileInterceptor('file'))
  async DeleteDocument(@Body() body,@Query() param,@Headers () auth,) {
    try {
      let field = await this.documentService.findOne(parseInt(body.id));
      field.isdeleted = true;
      let documentDetails = await this.documentService.findOne(parseInt(body.id));
      let dms = await documentDetails.dmsprovider;
      return this.fileService.deleteFile(field,dms).then(
        () => {
          return this.documentService.update(body.id, field);
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  }
}
