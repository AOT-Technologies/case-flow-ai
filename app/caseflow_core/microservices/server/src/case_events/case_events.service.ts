import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventTypes } from 'src/event_types/entities/event_type.entity';
import { EventTypesService } from 'src/event_types/event_types.service';
import { Repository } from 'typeorm';
import { CreateCaseEventInput } from './dto/create-case_event.input';
import { UpdateCaseEventInput } from './dto/update-case_event.input';
import { CaseEvents } from './entities/case_event.entity';

@Injectable()
export class CaseEventsService {

  constructor(
    @InjectRepository(CaseEvents) private caseEventRepository: Repository<CaseEvents>,private eventTypeService:EventTypesService
  ) {}
  
  create(createCaseEventInput: CreateCaseEventInput) {
    return 'This action adds a new caseEvent';
  }

  async findAll(): Promise<CaseEvents[]> {
    return this.caseEventRepository.find({relations:["eventtype"]});
  }



  async findOne(id: number): Promise<CaseEvents> {
      if(id){
        const value = await this.caseEventRepository.findOne({
          where: {
            id: id,
          },
          
        relations:["eventtype"]
          
        });
        if(value)return value
        throw new NotFoundException(`Record cannot find by id ${id}`);
      }
      throw new BadRequestException("request doesn't have any id")

  }

  update(id: number, updateCaseEventInput: UpdateCaseEventInput) {
    return `This action updates a #${id} caseEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} caseEvent`;
  }

  async getEventType(id: number): Promise<EventTypes> {
    return this.eventTypeService.findOne(id)
}
  
}
