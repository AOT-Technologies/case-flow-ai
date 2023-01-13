import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Query,
  Delete
} from '@nestjs/common';
import { Get, Patch } from '@nestjs/common/decorators';
import { TransformService } from 'src/helper/transform.service';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { UpdateCaseInput } from './dto/update-case.input';


//_____________________Custom Imports_____________________//

import { CasesService } from './cases.service';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService, private readonly TransformCase :TransformService) {}

  //Summary : create a new case.
  //Created By : Don Basil Peter 

  @Post()
  async uploadDocument(
  @Body() body,
  ): Promise<any> {
    const caseInput  = this.TransformCase.transformCreateCase(body)
    return this.casesService.createCase(caseInput);
  }

  //Summary : update a existing case by specifing field.
  //Created By : Don Basil Peter 

  @Patch()
  async updateDocument(
  @Body() body,
  ): Promise<any> {
    try{
      const field = await this.casesService.findOne(parseInt(body.id)).catch((err)=>{
        throw new HttpException(err.response, HttpStatus.NOT_FOUND)
      });
      if(!field?.isdeleted){
        const caseInput  = this.TransformCase.transformUpdateCase(body)
        return this.casesService.updateCase(body.id,caseInput);
      }
      else return new NotFoundException("No case found to update")
    }
    catch(err){
      console.log(err)
      return err.response
    }

  }

  //Summary : featch a case details by id
  //Created By : Don Basil Peter

  @Get()
  async fetchDocument(@Query() param): Promise<any>   {
    try{
      const field = await this.casesService.findOne(param.id).catch((err)=>{
        throw new HttpException(err.response, HttpStatus.NOT_FOUND)
      });
      if(!field?.isdeleted) return field
      throw new HttpException("The requested case is not found", HttpStatus.NOT_FOUND)
    }
    catch(err){
      return err
    }
  }

  //Summary : delete a case details by id
  //Created By : Don Basil Peter
  @Delete()
  async deleteDocument(@Query() param,): Promise<any>   {
    try{
      const field = await this.casesService.findOne(parseInt(param.id)).catch((err)=>{
        throw new HttpException(err.response, HttpStatus.NOT_FOUND)
      });
      if(!field?.isdeleted){
        const body = new UpdateCaseInput
        body.isdeleted = true
        return this.casesService.updateCase(param.id,body);
      }
      else return new NotFoundException("No case found to delete")
    }
    catch(err){
      console.log(err)
      return err.response
    }
  }
}
