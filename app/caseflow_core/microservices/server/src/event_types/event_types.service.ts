import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventTypeInput } from './dto/create-event_type.input';
import { UpdateEventTypeInput } from './dto/update-event_type.input';
import { EventTypes } from './entities/event_type.entity';

@Injectable()
export class EventTypesService {

  
  constructor(
    @InjectRepository(EventTypes) private eventTypeRepository: Repository<EventTypes>,
  ) {}
  
  create(createEventTypeInput: CreateEventTypeInput) {
    return 'This action adds a new eventType';
  }

  async findAll(): Promise<EventTypes[]> {
    return this.eventTypeRepository.find({relations:["caseevent"]});
  }



  async findOne(id: number): Promise<EventTypes> {
      if(id){
        const value = await this.eventTypeRepository.findOne({
          where: {
            id: id,
          },
          relations:["caseevent"]
        });
        if(value)return value
        throw new NotFoundException(`Record cannot find by id ${id}`);
      }
      throw new BadRequestException("request doesn't have any id")

  }

  update(id: number, updateEventTypeInput: UpdateEventTypeInput) {
    return `This action updates a #${id} eventType`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventType`;
  }
}
