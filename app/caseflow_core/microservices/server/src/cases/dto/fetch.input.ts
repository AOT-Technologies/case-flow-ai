import { Field, Int, ArgsType } from '@nestjs/graphql'
import { Max, Min } from 'class-validator'

@ArgsType()
export class FetchArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25
}

@ArgsType()
export class FetchCaseDocumentArgs{
  @Field(() => Int)
  @Min(0)
  skip = 0

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25

  @Field(()=>Int)
  id
}