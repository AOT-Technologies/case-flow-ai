import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cases } from 'src/cases/cases.entity';
import { CasesModule } from 'src/cases/cases.module';
import { CasesService } from 'src/cases/cases.service';
import { CaseEventsService } from 'src/case_events/case_events.service';
import { CaseEvents } from 'src/case_events/entities/case_event.entity';
import { Repository } from 'typeorm';
import { CreateCaseHistoryInput } from './dto/create-case_history.input';
import { UpdateCaseHistoryInput } from './dto/update-case_history.input';
import { CaseHistory } from './entities/case_history.entity';

@Injectable()
export class CaseHistoryService {

  constructor(
    @InjectRepository(CaseHistory) private caseHistoryRepository: Repository<CaseHistory>,private caseEventService: CaseEventsService
  ) {}

  async findAll(): Promise<CaseHistory[]> {
    return this.caseHistoryRepository.find({relations:["event","event.eventtype"]});
  }

  create(createCaseHistoryInput: CreateCaseHistoryInput) {
    return 'This action adds a new caseHistory';
  }



  async findOne(id: number): Promise<CaseHistory> {
    if(id){
      const value = await this.caseHistoryRepository.findOne({
        where: {
          id: id,
        },
        relations:["event","event.eventtype"]
        
      });
      if(value)
      return value
      throw new NotFoundException(`Record cannot find by id ${id}`);
    }
    throw new BadRequestException("request doesn't have any id")

}

  update(id: number, updateCaseHistoryInput: UpdateCaseHistoryInput) {
    return `This action updates a #${id} caseHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} caseHistory`;
  }

  async getCaseEvents(id: number): Promise<CaseEvents> {
    return this.caseEventService.findOne(id)
}

}
