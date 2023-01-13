import { CreateCaseEventInput } from './create-case_event.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCaseEventInput extends PartialType(CreateCaseEventInput) {
  @Field(() => Int)
  id: number;
}
