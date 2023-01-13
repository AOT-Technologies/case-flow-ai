import { CreateEventTypeInput } from './create-event_type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEventTypeInput extends PartialType(CreateEventTypeInput) {
  @Field(() => Int)
  id: number;
}
