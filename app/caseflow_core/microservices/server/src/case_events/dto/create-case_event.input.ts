import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCaseEventInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
