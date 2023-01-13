import { Module } from '@nestjs/common';
import { EventTypesService } from './event_types.service';
import { EventTypesResolver } from './event_types.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypes } from './entities/event_type.entity';
import { CaseEventsModule } from 'src/case_events/case_events.module';


@Module({
  imports: [TypeOrmModule.forFeature([EventTypes])],
  providers: [EventTypesResolver, EventTypesService],
  exports:[EventTypesService]
})
export class EventTypesModule {}
