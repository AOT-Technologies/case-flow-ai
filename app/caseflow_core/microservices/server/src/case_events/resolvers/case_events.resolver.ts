import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

//_____________________Custom Imports_____________________//

import { CaseEventsService } from '../services/case_events.service';
import { CaseEvents } from '../entities/case_event.entity';
import { CreateCaseEventInput } from '../dto/create-case_event.input';
import { UpdateCaseEventInput } from '../dto/update-case_event.input';

/**
 *  Resolvers For Cases
 */
@Resolver(() => CaseEvents)
export class CaseEventsResolver {
  constructor(private readonly caseEventsService: CaseEventsService) {}

  //_____________________Query_____________________//

  /**
   * Summary :   Query For Fetching case events
   * Created By : Akhila U S
   * @returns
   */
  @Query(() => [CaseEvents], { name: 'getAllCaseEvents' })
  findAll() {
    return this.caseEventsService.findAll();
  }

  /**
   * Summary :   Query For Fetching case events  by passing id
   * Created By : Akhila U S
   * @param args
   * @returns
   */
  @Query(() => CaseEvents, { name: 'caseEvent' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.caseEventsService.findOne(id);
  }

  //_____________________Mutation_____________________//

  /**
   * Summary : Mutation for Creating Case events
   * Created By : Akhila U S
   * @param createCaseEventInput
   * @returns
   */
  @Mutation(() => CaseEvents)
  createCaseEvent(
    @Args('createCaseEventInput') createCaseEventInput: CreateCaseEventInput,
  ) {
    return this.caseEventsService.create(createCaseEventInput);
  }

  /**
   * Summary : Mutation for update Case events
   * Created By : Akhila U S
   * @param updateCaseEventInput
   * @returns
   */
  @Mutation(() => CaseEvents)
  updateCaseEvent(
    @Args('updateCaseEventInput') updateCaseEventInput: UpdateCaseEventInput,
  ) {
    return this.caseEventsService.update(
      updateCaseEventInput.id,
      updateCaseEventInput,
    );
  }

  /**
   * Summary : Mutation for remove Case events
   * Created By : Akhila U S
   * @param id
   * @returns
   */
  @Mutation(() => CaseEvents)
  removeCaseEvent(@Args('id', { type: () => Int }) id: number) {
    return this.caseEventsService.remove(id);
  }

}
