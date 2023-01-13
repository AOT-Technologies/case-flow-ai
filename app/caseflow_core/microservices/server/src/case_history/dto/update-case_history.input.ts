import { CreateCaseHistoryInput } from './create-case_history.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCaseHistoryInput extends PartialType(CreateCaseHistoryInput) {
  @Field(() => Int)
  id: number;
}
