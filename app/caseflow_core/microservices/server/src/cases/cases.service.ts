import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Like } from 'typeorm';
import { AuthGuard, RoleGuard, RoleMatchingMode, Roles, Unprotected } from 'nest-keycloak-connect';

//_____________________Custom Imports_____________________//
import { Cases, casesResponse } from './cases.entity';
import { CreateCaseInput } from './dto/create-case.input';
import { UpdateCaseInput } from './dto/update-case.input';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { CaseHistoryService } from 'src/case_history/case_history.service';
import { CaseHistory } from 'src/case_history/entities/case_history.entity';
import { FetchArgs } from './dto/fetch.input';


@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Cases) private caseRepository: Repository<Cases>
  ) {}


  async findAll({relations:["casehistory","casehistory.event","casehistory.event.eventtype"]},args: FetchArgs = { skip: 0, take: 5 }): Promise<casesResponse> {       
    const [Cases,totalCount] =await Promise.all([
      this.caseRepository.find(
        {
          take: args.take,
          skip: args.skip,
        }
      ),
      this.caseRepository.count()
    ])    
    return {Cases,totalCount}

  }

  
  async findAllWithLimit(): Promise<Cases[]> {
    return this.caseRepository.find({
      take: 10,    order: {
        id:"DESC"
    }
  });
  }
  // @Roles({ roles: ['manage-account'], mode: RoleMatchingMode.ANY })
  async createCase(createCaseInput: CreateCaseInput): Promise<Cases> {
    try {
      const newCase = this.caseRepository.create(createCaseInput);
      return this.caseRepository.save(newCase);
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(id: number): Promise<Cases> {
      if(id){
        const value = await this.caseRepository.findOne({
          where: {
            id: id,
          },
          relations:["casehistory","casehistory.event","casehistory.event.eventtype"]},);
        if(value)return value

        throw new NotFoundException(`Record cannot find by id ${id}`);
      }
      throw new BadRequestException("request doesn't have any id")

  }

  async updateCase(id: number, updateCaseInput: UpdateCaseInput) {
    return await this.caseRepository
      .update(id, updateCaseInput)
      .then(() => {
        return this.findOne(id).catch((err)=>{
          throw new HttpException(err.response, HttpStatus.NOT_FOUND)
        });
      })
  }

  async remove(id: number) {
    let caseData = this.caseRepository.findOne({
      where: {
        id: id,
      },
    });
    if (caseData) {
      let ret = await this.caseRepository.delete(id);
      if (ret.affected === 1) {
        return caseData;
      }
    }
    throw new NotFoundException(`Record cannot find by id ${id}`);
  }

  searchCase(searchField,searchColumn){
    try{
    if(searchColumn){
      switch(searchColumn){
        case 'Description': {
          return this.caseRepository.createQueryBuilder("table")
          .where("LOWER(table.desc) LIKE :title", { title: `%${ searchField.toLowerCase() }%` })
          .getMany();
        }
        default :
        return this.caseRepository.createQueryBuilder("table")
        .where("LOWER(table.name) LIKE :title", { title: `%${ searchField.toLowerCase() }%` })
        .getMany();
      }
    }
    else{
      return  new HttpException("select a field", HttpStatus.BAD_REQUEST)
    }

    }
    catch{
      throw new HttpException("something went wrong", HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }
}

