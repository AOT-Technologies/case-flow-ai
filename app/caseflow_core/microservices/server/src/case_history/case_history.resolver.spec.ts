import { Test, TestingModule } from '@nestjs/testing';
import { CaseHistoryResolver } from './case_history.resolver';
import { CaseHistoryService } from './case_history.service';

describe('CaseHistoryResolver', () => {
  let resolver: CaseHistoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseHistoryResolver, CaseHistoryService],
    }).compile();

    resolver = module.get<CaseHistoryResolver>(CaseHistoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
