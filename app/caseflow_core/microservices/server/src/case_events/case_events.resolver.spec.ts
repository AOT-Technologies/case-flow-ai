import { Test, TestingModule } from '@nestjs/testing';
import { CaseEventsResolver } from './case_events.resolver';
import { CaseEventsService } from './case_events.service';

describe('CaseEventsResolver', () => {
  let resolver: CaseEventsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseEventsResolver, CaseEventsService],
    }).compile();

    resolver = module.get<CaseEventsResolver>(CaseEventsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
