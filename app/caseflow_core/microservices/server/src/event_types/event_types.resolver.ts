import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventTypesService } from './event_types.service';
import { EventTypes } from './entities/event_type.entity';
import { CreateEventTypeInput } from './dto/create-event_type.input';
import { UpdateEventTypeInput } from './dto/update-event_type.input';

@Resolver(() => EventTypes)
export class EventTypesResolver {
  constructor(private readonly eventTypesService: EventTypesService) {}

  @Mutation(() => EventTypes)
  createEventType(@Args('createEventTypeInput') createEventTypeInput: CreateEventTypeInput) {
    return this.eventTypesService.create(createEventTypeInput);
  }

  @Query(() => [EventTypes], { name: 'eventTypes' })
  findAll() {
    return this.eventTypesService.findAll();
  }

  @Query(() => EventTypes, { name: 'eventType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.eventTypesService.findOne(id);
  }

  @Mutation(() => EventTypes)
  updateEventType(@Args('updateEventTypeInput') updateEventTypeInput: UpdateEventTypeInput) {
    return this.eventTypesService.update(updateEventTypeInput.id, updateEventTypeInput);
  }

  @Mutation(() => EventTypes)
  removeEventType(@Args('id', { type: () => Int }) id: number) {
    return this.eventTypesService.remove(id);
  }
}
