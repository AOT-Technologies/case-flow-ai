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

  @Post('/upload')
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
// edit document
@Put('/upload')
  // @MessagePattern({ cmd: 'edit_document' })
  @UseInterceptors(FileInterceptor('file'))
  async EditDocument(@UploadedFile() file: Express.Multer.File,@Body() body,@Headers () auth,) {
    try {
      if(body && body?.id)
      {
        const token=auth?.authorization;
        const document = await this.documentService.findOne(parseInt(body?.id));
        if(!document?.isdeleted) {
          let documentDetails = await (file && document && body?.dmsprovider
            ? this.fileService.updateFile(file, body,document, body?.dmsprovider,token)
            : null);
          let formattedDocument: any = await this.helper.transform(body?.dmsprovider,'UPDATE',documentDetails,body);
          return this.documentService.updateDocument(body?.id, formattedDocument);
      }
      else {
        console.log("No file found to update")
      }
    }
    else{
      console.log("Request body is not valid");
    }

    } catch (err) {
      console.log(err.message);
    }
  }



  // for delete documents
  @Delete('/delete')
  @UseInterceptors(FileInterceptor('file'))
  async DeleteDocument(@Body() body,@Headers () auth,) {
    try {
      if(body && body?.id)
      {
        let documentDetails = await this.documentService.findOne(parseInt(body.id));
        documentDetails.isdeleted = true;
        let dms =  await documentDetails?.dmsprovider;
        return this.fileService.deleteFile(documentDetails,dms,auth?.authorization).then(
          async () => {
            const deleteData= await this.documentService.update(body?.id, documentDetails);
            return deleteData;
          },
        );
        }
      else{
        console.log("docid not provided");
      }
    } catch (error) {
      console.log(error.message);
    }
  }


    // for  fetch documents - rest call
    @Post('/fetch')
    @UseInterceptors(FileInterceptor('file'))
    async FetchDocument(@Body() body,@Headers () auth,) {
      try {   
        if(body && body?.id && auth?.authorization){
          let doc_id = null;
          let documentDetails = await this.documentService.findOne(parseInt(body.id));
          let dms =  documentDetails.dmsprovider;
          if(dms===2){
            doc_id = await (documentDetails ).name;
          }   else{
            doc_id = await (
              documentDetails
            ).documentref;
          }  
          const data = await this.fileService.downloadFile(doc_id, dms,auth?.authorization);
          return {data : data , type : documentDetails.type,name : documentDetails.name,dmsprovider : documentDetails.dmsprovider}
      }
    else{
      console.log("DocId/header not provided");
    }} catch (error) {
        console.log(error.message);
      }
    }
}
