import { Body,Headers , Controller, Post, UploadedFile, UseInterceptors,Delete, Get, Patch,NotFoundException, Put, Query,Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response as ExpressResponse } from 'express';
//_____________________Custom Imports_____________________//
import { FileService } from '../helpers/file.service';

import { DocumentsService } from './services/documents.service';
import { TransformService } from '../helpers/transform.service';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import { createDocumentSchema, deleteDocumentSchema, downloadDocumentSchema, updateDocumentSchema } from 'src/validation-schemas/document_validation.schema';
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly fileService: FileService,
    private helper: TransformService,
    private documentService: DocumentsService,
  ) {}
  @Post('/uploadDocument')
  // @MessagePattern({ cmd: 'create_document' })
   @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,@Body(new JoiValidationPipe(createDocumentSchema)) body,@Headers () auth) {
      try {
    let documentDetails = await this.fileService.uploadFile(file, body, body.dmsprovider,auth.authorization);
    let formattedDocument: any = this.helper.transform(
      body.dmsprovider,
      'CREATE',
      documentDetails,
      body,
    );
    const datamew = this.documentService.createDocument(formattedDocument);
    return datamew
  } catch (err) {
    console.log(err.message);
  }
  }

  @Put()
  // @MessagePattern({ cmd: 'edit_document' })
  @UseInterceptors(FileInterceptor('file'))
  async editDocument(@UploadedFile() file: Express.Multer.File,@Body(new JoiValidationPipe(updateDocumentSchema)) body,@Headers () auth,) {
    try {
      const document = await this.documentService.findOne(parseInt(body.id));
      const token=auth?.authorization
      if(!document.isdeleted) {
        let documentDetails = await (body.file && document && body.dmsprovider
          ? this.fileService.updateFile(body.file, body,document, body.dmsprovider,token)
          : null);
        let formattedDocument: any = this.helper.transform(
          body.dmsprovider,
          'UPDATE',
          documentDetails,
          body,
        );
        console.log('document', formattedDocument);
        return this.documentService.update(body.id, document);
      }
      else {
        return new NotFoundException("No file found to update")
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  @Get("/download")
  // @MessagePattern({ cmd: 'fetch_document' })
  async fetchDocument(@Query(new JoiValidationPipe(downloadDocumentSchema))param,@Response() res: ExpressResponse,@Headers () auth) {
    const token=auth?.authorization;
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
      if(dms !== 2){
        return res.send(new Buffer(data));

      }else{
        return res.send(data)
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  @Delete("/delete")
  // @MessagePattern({ cmd: 'delete_document' })
  async DeleteDocument(@Query(new JoiValidationPipe(deleteDocumentSchema))param) {
    try {
      let field = await this.documentService.findOne(parseInt(param.id));
      field.isdeleted = true;
      let documentDetails = await this.documentService.findOne(parseInt(param.id));
      let dms = await documentDetails.dmsprovider;
      return this.fileService.deleteFile(field,dms).then(
        () => {
          return this.documentService.update(param.id, field);
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  }
}
