import { Test, TestingModule } from '@nestjs/testing';
import { CaseEventsService } from './case_events.service';

describe('CaseEventsService', () => {
  let service: CaseEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseEventsService],
    }).compile();

    service = module.get<CaseEventsService>(CaseEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
