import { Test, TestingModule } from '@nestjs/testing';
import { EventTypesResolver } from './event_types.resolver';
import { EventTypesService } from './event_types.service';

describe('EventTypesResolver', () => {
  let resolver: EventTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventTypesResolver, EventTypesService],
    }).compile();

    resolver = module.get<EventTypesResolver>(EventTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
