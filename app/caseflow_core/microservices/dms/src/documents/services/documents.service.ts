import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//_____________________Custom Imports_____________________//
import { CreateDocumentInput } from '../dto/create-document.input';
import {  Documents } from '../entities/documents.entity';
import { UpdateDocumentInput } from '../dto/update-documet.input';
import { VersionsService } from 'src/versions/services/versions.service';
/**
 *  Service For documents
 */

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Documents)
    private documentRepository: Repository<Documents>,private versionService: VersionsService
  ) {}

  // summery : Get all documents
  // Created By : Don C Varghese
  async findAll(): Promise<Documents[]> {
    try {
    return await this.documentRepository.find({
      where: {
        isdeleted: false,
      },
      order: {
        id: "DESC",
       
},relations:["versions"]
    });
  } catch (err) {
    console.log(err);
  }
  }

  // summery : Create a new document
  // Created By : Don C Varghese
  async createDocument(
    createDocumentInput: CreateDocumentInput,
  ): Promise<Documents> {
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
      return await this.findOne(docdata?.id);
      
    }else{
      console.log("Error in doc upload");
    }
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
        return await this.findOne(id);
        //return docdata;
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
  async findOne( id : number ): Promise<Documents> {
    try{
      return await this.documentRepository.findOne({
        where: {
          id: id,
        },
        order: {
          id: "DESC",
  },relations:["versions"]
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


//hard delete
  async remove(id: number) {
    try {
    let docData = await this.documentRepository.findOne({
      where: {
        id: id,
      },
    });
    if (docData) {
      let ret = await this.documentRepository.delete(id);
      if (ret.affected === 1) {
        return docData;
      }
    }
    console.log(`Record cannot find by id ${id}`);
  } catch (err) {
    console.log(err);
  }
  }

}
