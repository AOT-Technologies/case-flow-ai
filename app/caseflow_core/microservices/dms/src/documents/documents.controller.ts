import { Body,Headers , Controller, Post, UploadedFile, UseInterceptors,Delete, Get, Patch,NotFoundException, Put, Query,UsePipes, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

//_____________________Custom Imports_____________________//
import { FileService } from '../helpers/file.service';
import { AuthService } from '../helpers/auth.service';

import { createDocumentSchema, deleteDocumentSchema, downloadDocumentSchema, fetchDocumentByIdSchema, fetchDocumentByRefIdSchema, updateDocumentSchema } from "../validation-schemas/document_validation.schema"
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
      if(body && body?.dmsprovider && auth?.authorization){
        let documentDetails;  
        try {
         documentDetails = await this.fileService.uploadFile(file, body, body?.dmsprovider,auth?.authorization)
      } catch (error) { 
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Document uploaded issue',}, HttpStatus.FORBIDDEN, {cause: error});
      }
        try{
        const user: any = await this.auth.getTokenUser(auth?.authorization);
        const formattedDocument: any = await this.helper.transform(body?.dmsprovider,'CREATE',documentDetails,body,user);
        const docdata = await this.documentService.createDocument(formattedDocument);
        if(docdata && docdata?.id){
        return {
          status:"success",
          data:docdata
        }
      }else{
        throw new BadRequestException("Error Occurs in DB insert !")
      }
      } catch (error) { 
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'Document uploaded issue',
        }, HttpStatus.FORBIDDEN, {
          cause: error
        });
      }
    }
      else{
        throw new BadRequestException("Request body/header Not provided")
      }
  
  }
// edit document
@Put('/upload')
  // @MessagePattern({ cmd: 'edit_document' })
  @UseInterceptors(FileInterceptor('file'))
  async EditDocument(@UploadedFile() file: Express.Multer.File,@Body(new JoiValidationPipe(updateDocumentSchema)) body,@Headers () auth,) {
      if(body && body?.id)
      {
        const token=auth?.authorization;
        const document = await this.documentService.findOne(parseInt(body?.id));
        if(!document?.isdeleted) {
          let documentDetails;
          try{
           documentDetails = await (file && document && body?.dmsprovider? this.fileService.updateFile(file, body,document, body?.dmsprovider,token): null);
          
        } catch (error) { 
          throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Document uploaded issue',}, HttpStatus.FORBIDDEN, {cause: error});
        }
        try{
          const user: any = await this.auth.getTokenUser(auth?.authorization);
          let formattedDocument: any = await this.helper.transform(body?.dmsprovider,'UPDATE',documentDetails,body,user);
          const docdata = await this.documentService.updateDocument(body?.id, formattedDocument);

          if(docdata && docdata?.id){
         return {
            status:"success",
            data:docdata
          }
        }else{
          throw new BadRequestException("Error!! Data Not Found In DB")
        }
      
    } catch (error) { 
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Document uploaded issue',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
    }
    else{
      throw new BadRequestException("No file found to update");
      }
    }
    else{
      throw new BadRequestException("Request body/header Not Valid");

    }}



  // for delete documents
  @Delete('/delete')
  @UseInterceptors(FileInterceptor('file'))
  async DeleteDocument(@Body(new JoiValidationPipe(deleteDocumentSchema)) body,@Headers () auth,) {
    
      if(body && body?.id)
      {
        let documentDetails;
        let dms;
        try {
        documentDetails = await this.documentService.findDocumentById(parseInt(body.id));
        documentDetails.isdeleted = true;
        dms =  await documentDetails?.dmsprovider;
      } catch (error) { 
        throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'DocumentId Not found in server',}, HttpStatus.FORBIDDEN, {cause: error});
      }
        try {
        const deleteFile=await this.fileService.deleteFile(documentDetails,dms,auth?.authorization);
      } catch (error) { 
        throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Document Delete issue',}, HttpStatus.FORBIDDEN, {cause: error});
      }
         try{
            const deleteData= await this.documentService.update(body?.id, documentDetails);
            if(deleteData && deleteData?.id && deleteData?.isdeleted==true){
            return {
              status:"success",
              data:deleteData
            }
          }else{
            throw new BadRequestException("Error while deleting");
            }
      } catch (error) { 
        throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Document delete issue',}, HttpStatus.FORBIDDEN, {cause: error});
      }}
      else{
        throw new BadRequestException("Document id not given");
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
          try{
         const deleteFile=await this.fileService.deleteFile(documentDetails,dms,auth?.authorization);
        } catch (error) { 
          throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Document delete issue',}, HttpStatus.FORBIDDEN, {cause: error});
        }
          
         const deleteData= await this.documentService.remove(body?.id); 
         return {
            status:"success",
            data:deleteData
          }
          }
        else{
          throw new BadRequestException("No Document id provided");
        }
      } catch (error) { 
        throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Document delete issue',}, HttpStatus.FORBIDDEN, {cause: error});
      }
    }


    // for  fetch documents - rest call
    @Get('/download')
    @UseInterceptors(FileInterceptor('file'))
    async FetchDocument(@Query(new JoiValidationPipe(downloadDocumentSchema)) param,@Headers () auth,) {
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
      throw new BadRequestException("Document ID / Header not provided !");
    }  } catch (error) { 
      throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Error Occurs While Downloading !',}, HttpStatus.FORBIDDEN, {cause: error});
    }
    }


    // Fetch Document by Document Id
    @Get('/fetchDocumentById')
    @UseInterceptors(FileInterceptor('file'))
    async FetchDocumentById(@Query(new JoiValidationPipe(fetchDocumentByIdSchema)) param,@Headers () auth,) {
      try {   
        if(param && param?.id && auth?.authorization){          
          let documentDetails = await this.documentService.findOne(parseInt(param.id));  
          if(documentDetails && documentDetails?.id){
            return {
              status:"success",
              data:documentDetails
            }
          }else{
            throw new BadRequestException("Error!! Data Not Found In DB")
          }
      }
    else{
      throw new BadRequestException("DocumentID / header not provided");
    }  } catch (error) { 
      throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Some error occurs during document fetch !',}, HttpStatus.FORBIDDEN, {cause: error});
    }
    }



    //Fetch All Documents related to the Reference Id
    @Get('/fetchDocumentByRefId')
    @UseInterceptors(FileInterceptor('file'))
    async FetchDocumentByRefId(@Query(new JoiValidationPipe(fetchDocumentByRefIdSchema)) param,@Headers () auth,) {
      try {   
        if(param && param?.referenceId && auth?.authorization){          
          let documentDetails = await this.documentService.findDocumentByRefId(param.referenceId);  
          if(documentDetails ){
            return {
              status:"success",
              data:documentDetails
            }
          }else{
            throw new BadRequestException("Error!! Data Not Found In DB")
          }
      }
    else{
      throw new BadRequestException("Reference ID /header not provided");
    }  } catch (error) { 
      throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Some error occurs during document fetch !',}, HttpStatus.FORBIDDEN, {cause: error});
    }
    }


    //Fetch All Documents
    @Get('/fetchDocuments')
    @UseInterceptors(FileInterceptor('file'))
    async FetchDocuments(@Headers () auth,) {
      try {   
        if( auth?.authorization){          
          let documentDetails = await this.documentService.findAll();  
          if(documentDetails ){
            return {
              status:"success",
              data:documentDetails
            }
          }else{
            throw new BadRequestException("Error!! Data Not Found In DB")
          }
      }
    else{
      throw new BadRequestException("header not provided");
    }  } catch (error) { 
      throw new HttpException({status: HttpStatus.FORBIDDEN,error: 'Some error occurs during document fetch !',}, HttpStatus.FORBIDDEN, {cause: error});
    }
    }
}
