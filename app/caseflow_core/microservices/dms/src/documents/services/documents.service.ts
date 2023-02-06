import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//_____________________Custom Imports_____________________//
import { CreateDocumentInput } from '../dto/create-document.input';
import {  CaseDocuments } from '../entities/documents.entity';
import { UpdateDocumentInput } from '../dto/update-documet.input';
import { VersionsService } from 'src/versions/services/versions.service';
/**
 *  Service For documents
 */

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(CaseDocuments)
    private documentRepository: Repository<CaseDocuments>,private versionService: VersionsService
  ) {}

  // summery : Get all documents
  // Created By : Don C Varghese
  async findAll(): Promise<CaseDocuments[]> {
    try {
    return await this.documentRepository.find({
      where: {
        isdeleted: false,
      },
      order: {
        id: "DESC",
       
},
    });
  } catch (err) {
    console.log(err);
  }
  }

  // summery : Create a new document
  // Created By : Don C Varghese
  async createDocument(
    createDocumentInput: CreateDocumentInput,
  ): Promise<CaseDocuments> {
    try {
      const newCase =  this.documentRepository.create(createDocumentInput);
      const docdata=await this.documentRepository.save(newCase);
      if(docdata && docdata?.id){
      const documentid=docdata?.id;
      const versiondetails=await this.versionService.findDocument(documentid);
      const versionNumber=(versiondetails && versiondetails?.versions)?versiondetails?.versions:0;
      const versionData={
        docid:docdata?.id,
        documentid:docdata?.latestversion,
        versions:versionNumber?(versionNumber+1):1,
        creationdate:new Date(),
        modificationdate:new Date()
      }
      const data=await this.versionService.create(versionData);
    }else{
      console.log("Error in doc upload");
    }
      return docdata;
    } catch (err) {
      console.log(err);
    }
  }


    // summery : update a new document
  // Created By : Don C Varghese
  async updateDocument(id: number, updateCaseInput: UpdateDocumentInput) {
    try {
    return await this.documentRepository.update(id,updateCaseInput)
    .then(async ()=> {
      const docdata=await this.findOne(id);
      if(docdata){
        const versiondetails=await this.versionService.findDocument(id);
        const versionNumber=(versiondetails && versiondetails?.versions)?versiondetails?.versions:0;
        const versionData={
          docid:id,
          documentid:(await docdata)?.latestversion,
          versions:versionNumber?(versionNumber+1):1,
          creationdate:new Date(),
          modificationdate:new Date()
        }
        const data=await this.versionService.create(versionData);
        return docdata;
      }else{
        console.log("Error in doc upload");
      } 
    })
    .catch( (e) => {
      console.error(e.message)
    })
  } catch (err) {
    console.log(err);
  }
  }

  // summery : Select  single document
  // Created By : Don C Varghese
  async findOne( id : number ): Promise<CaseDocuments> {
    try{
      return await this.documentRepository.findOne({
        where: {
          id: id,
        },
        order: {
          id: "DESC",
  }
      },
       );           
    }catch(err){
      console.log(err)
    }
  }

  // summery : Update a new document
  // Created By : Don C Varghese
  async update(id: number, updateCaseInput: UpdateDocumentInput) {
    try {
    return await this.documentRepository.update(id,updateCaseInput)
    .then(()=> {
    return this.findOne(id)
    })
    .catch( (e) => {
      console.error(e.message)
    })
  } catch (err) {
    console.log(err);
  }
  }

 

}
