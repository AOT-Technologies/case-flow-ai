import { Module } from '@nestjs/common';
import { CaseHistoryService } from './case_history.service';
import { CaseHistoryResolver } from './case_history.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CasesService } from 'src/cases/cases.service';
import { CasesModule } from 'src/cases/cases.module';
import { CaseHistory } from './entities/case_history.entity';
import { CaseEventsModule } from 'src/case_events/case_events.module';

@Module({
  imports: [TypeOrmModule.forFeature([CaseHistory]),CasesModule,CaseEventsModule],
  providers: [CaseHistoryResolver, CaseHistoryService]

})
export class CaseHistoryModule {}
