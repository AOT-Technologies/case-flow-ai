import { Test, TestingModule } from '@nestjs/testing';
import { CasesResolver } from './cases.resolver';

describe('CasesResolver', () => {
  let resolver: CasesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasesResolver],
    }).compile();

    resolver = module.get<CasesResolver>(CasesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
