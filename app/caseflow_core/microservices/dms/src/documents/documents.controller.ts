import { Body,Headers , Controller, Post, UploadedFile, UseInterceptors,Delete, Get, Patch,NotFoundException, Put, Query,UsePipes } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

//_____________________Custom Imports_____________________//
import { FileService } from '../helpers/file.service';
import { AuthService } from '../helpers/auth.service';

import { createDocumentSchema, deleteDocumentSchema, updateDocumentSchema } from "../validation-schemas/document_validation.schema"
import { DocumentsService } from './services/documents.service';
import { Express } from 'express';
import { TransformService } from '../helpers/transform.service';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly fileService: FileService,
    private helper: TransformService,
    private auth: AuthService,
    private documentService: DocumentsService,
  ) {}

  //for upload documents

  @Post('/upload')
  // @UsePipes(new JoiValidationPipe(createDocumentSchema))
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,@Body(new JoiValidationPipe(createDocumentSchema)) body,@Headers () auth) {
      try {
      if(body && body?.dmsprovider && auth?.authorization){    
        const documentDetails = await this.fileService.uploadFile(file, body, body?.dmsprovider,auth?.authorization);
        const user: any = await this.auth.getTokenUser(auth?.authorization);
        const formattedDocument: any = await this.helper.transform(body?.dmsprovider,'CREATE',documentDetails,body,user);
        const docdata = await this.documentService.createDocument(formattedDocument);
        let response;
        if(docdata && docdata?.id){
        response={
          status:"success",
          data:docdata
        }
      }else{
       response={
          status:"error",
          data:docdata
        }
      }
        return response;
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
  async EditDocument(@UploadedFile() file: Express.Multer.File,@Body(new JoiValidationPipe(updateDocumentSchema)) body,@Headers () auth,) {
    try {
      if(body && body?.id)
      {
        const token=auth?.authorization;
        const document = await this.documentService.findOne(parseInt(body?.id));
        if(!document?.isdeleted) {
          let documentDetails = await (file && document && body?.dmsprovider
            ? this.fileService.updateFile(file, body,document, body?.dmsprovider,token)
            : null);
            const user: any = await this.auth.getTokenUser(auth?.authorization);

          let formattedDocument: any = await this.helper.transform(body?.dmsprovider,'UPDATE',documentDetails,body,user);
          const docdata = await this.documentService.updateDocument(body?.id, formattedDocument);
          
          let response;
          if(docdata && docdata?.id){
          response={
            status:"success",
            data:docdata
          }
        }else{
         response={
            status:"error",
            data:docdata
          }
        }
        return response;
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
  async DeleteDocument(@Body(new JoiValidationPipe(deleteDocumentSchema)) body,@Headers () auth,) {
    try {
      if(body && body?.id)
      {
        let documentDetails = await this.documentService.findDocumentById(parseInt(body.id));
        documentDetails.isdeleted = true;
        let dms =  await documentDetails?.dmsprovider;
        return this.fileService.deleteFile(documentDetails,dms,auth?.authorization).then(
          async () => {
            const deleteData= await this.documentService.update(body?.id, documentDetails);
            
            let response;
            if(deleteData && deleteData?.id && deleteData?.isdeleted==true){
            response={
              status:"success",
              data:deleteData
            }
          }else{
           response={
              status:"error",
              data:deleteData
            }
          }
        return response;
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


    // hard delete documents
    @Delete('/deleteDoc')
    @UseInterceptors(FileInterceptor('file'))
    async DeleteDocumentDoc(@Body(new JoiValidationPipe(deleteDocumentSchema)) body,@Headers () auth,) {
      try {
        if(body && body?.id)
        {
          let documentDetails = await this.documentService.findDocumentById(parseInt(body.id));
          documentDetails.isdeleted = true;
          let dms =  await documentDetails?.dmsprovider;
          return this.fileService.deleteFile(documentDetails,dms,auth?.authorization).then(
            async () => {
              const deleteData= await this.documentService.remove(body?.id);
              
          const response={
            status:"success",
            data:deleteData
          }
          return response;
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
    @Get('/download')
    @UseInterceptors(FileInterceptor('file'))
    async FetchDocument(@Query(new JoiValidationPipe(updateDocumentSchema)) param,@Headers () auth,) {
      try {   
        if(param && param?.id && auth?.authorization){
          let doc_id = null;
          let documentDetails = await this.documentService.findOne(parseInt(param.id));
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
