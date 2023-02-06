import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Summary :  Create input DTO for documents
 * Created By : Akhila U S
 */
@InputType()
export class CreateDocumentInput {
  @Field((type) => Int, { nullable: true })
  referenceId: string;

  @Field()
  documentref: string;

  @Field({ nullable: true })
  desc: string;

  @Field({ nullable: true })
  addedbyuserid: number;

  @Field({ defaultValue: new Date() })
  creationdate: Date;

  @Field()
  dmsprovider: number;

  @Field()
  name: string;

  @Field()
  latestversion: string;

  @Field({ defaultValue: false })
  isdeleted: boolean;

  @Field({ nullable: true })
  type: string;
}
