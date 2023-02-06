import { Field, InputType, Int } from '@nestjs/graphql';
/**
 * Summary :  Create update DTO for documents
 * Created By : Akhila U S
 */
@InputType()
export class UpdateDocumentInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int, { nullable: true })
  referenceId: string;

  @Field()
  documentref: string;

  @Field({ nullable: true })
  desc: string;

  @Field()
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
}
