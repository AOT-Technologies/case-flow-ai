import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//_____________________Custom Imports_____________________//

import { EventTypes } from '../../event_types/entities/event_type.entity';
import { EventTypesService } from '../../event_types/services/event_types.service';
import { CreateCaseEventInput } from '../dto/create-case_event.input';
import { UpdateCaseEventInput } from '../dto/update-case_event.input';
import { CaseEvents } from '../entities/case_event.entity';

/**
 *  Service For Case events
 */
@Injectable()
export class CaseEventsService {
  constructor(
    @InjectRepository(CaseEvents)
    private caseEventRepository: Repository<CaseEvents>,
    private eventTypeService: EventTypesService,
  ) {}

  /**
   * Create Method For Creating New Cases
   * @param createCaseEventInput
   * @returns
   */
  async create(createCaseEventInput: CreateCaseEventInput) {
    try {
      const newCaseEvent =
        this.caseEventRepository.create(createCaseEventInput);
      const data = await this.caseEventRepository.save(newCaseEvent);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Find All Method for Returning All Cases with pagination
   * @param args
   * @returns
   */

  async findAll(): Promise<CaseEvents[]> {
    try {
      return this.caseEventRepository.find({ relations: ['eventtype'] });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Find One Method For Returning Specific case event
   * @param id
   * @returns
   */

  async findOne(id: number): Promise<CaseEvents> {
    try {
      if (id) {
        const value = await this.caseEventRepository.findOne({
          where: {
            id: id,
          },

          relations: ['eventtype'],
        });
        if (value) return value;
        throw new NotFoundException(`Record cannot find by id ${id}`);
      }
      throw new BadRequestException("request doesn't have any id");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Update Case event
   * @param id
   * @param updateCaseEventInput
   * @returns
   */
  update(id: number, updateCaseEventInput: UpdateCaseEventInput) {
    return `This action updates a #${id} caseEvent`;
  }

  /**
   * method for remove case event
   * @param id
   * @returns
   */
  remove(id: number) {
    return `This action removes a #${id} caseEvent`;
  }

  /**
   * get eventype by passing id
   * @param id
   * @returns
   */
  async getEventType(id: number): Promise<EventTypes> {
    try {
      return this.eventTypeService.findOne(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
