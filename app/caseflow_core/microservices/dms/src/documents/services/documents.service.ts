import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//_____________________Custom Imports_____________________//
import { CreateDocumentInput } from '../dto/create-document.input';
import {  CaseDocuments } from '../entities/documents.entity';
import { UpdateDocumentInput } from '../dto/update-documet.input';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { FetchArgs } from '../dto/fetch-args.input';
import { caseDocumentResponse } from '../entities/case_document_response.entity';
import {  Versions } from 'src/versions/entities/version.entity';
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
    .then( ()=> this.findOne(id))
    .catch( (e) => {
      console.error(e.message)
    })
  } catch (err) {
    console.log(err);
  }
  }

  // summery : Delete a new document
  // Created By : Don C Varghese
  async remove(id: number) {
    try {
    let caseData = await this.documentRepository.findOne({
      where: {
        id: id,
      },
    });
    if (caseData) {
      let ret = await this.documentRepository.delete(id);
      if (ret.affected === 1) {
        return caseData;
      }
    }
    console.log(`Record cannot find by id ${id}`);
  } catch (err) {
    console.log(err);
  }
  }

   // summery : Paginated Document list by caseID
  // Created By : Gokul VG
  async forCases(args: FetchArgs,id:number):Promise<caseDocumentResponse>{
    try {
    const [CaseDocuments,totalCount] =await Promise.all([
      this.documentRepository.find({relations:["versions"],
        
          take: args.take,
          skip: args.skip,
          where:{ "caseId":id,isdeleted: false},
          order: {
          id: "DESC",
          versions:{
            id:"DESC"
          }
         }
        }
      ),
      this.documentRepository.count(
        {
          where:{ "caseId":id,isdeleted: false}
        }
      )
    ])    
    return {CaseDocuments,totalCount} 
    // const output =await this.documentRepository.findAndCount({
    //       take:args.take,
    //       skip:args.skip,
    //        where:{ "caseid":id}})
    // return {output,count}
  } catch (err) {
    console.log(err);
  }
  }
/**
 * method for search documents
 * @param searchField 
 * @param searchColumn 
 * @returns 
 */
  async searchCaseDocument(searchField,searchColumn){
    try{
    if(searchColumn){
      switch(searchColumn){
        case 'Description': {
          return await this.documentRepository.createQueryBuilder("table")
          .where("LOWER(table.desc) LIKE :title", { title: `%${ searchField.toLowerCase() }%` })
          .andWhere("table.isdeleted =:isDeleted",{isDeleted:false})
          .getMany();
        }
        default :
        return await this.documentRepository.createQueryBuilder("table")
        .where("LOWER(table.name) LIKE :title", { title: `%${ searchField.toLowerCase() }%` })
        .andWhere("table.isdeleted =:isDeleted",{isDeleted:false})
        .getMany();
      }
    }
    else{
      console.log("select a field", HttpStatus.BAD_REQUEST)
    }

    }
    catch{
      console.log("something went wrong", HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

}
