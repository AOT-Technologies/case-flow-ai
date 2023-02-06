
import { Field, ObjectType, Int,Directive,ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Versions }  from 'src/versions/entities/version.entity';
/**
 * Summary :  Entity Class For documents
 * Created By : Akhila U S
 */

@Entity()
@ObjectType()
@Directive('@key(fields:"id")')
export class CaseDocuments {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column()
  @Field()
  referenceId: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  documentref: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  desc: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  addedbyuserid: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  creationdate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dmsprovider: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  latestversion: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  isdeleted: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  type: string;


  
  @OneToMany(() => Versions, (versions) => versions.documents)
  @Field(() => [Versions], { nullable: true })
  versions: Versions[]
}





