import { Test, TestingModule } from '@nestjs/testing';
import { CaseHistoryService } from './case_history.service';

describe('CaseHistoryService', () => {
  let service: CaseHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaseHistoryService],
    }).compile();

    service = module.get<CaseHistoryService>(CaseHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
