import { Field, ObjectType, Int ,Directive,ID } from '@nestjs/graphql';
import { CaseHistory } from 'src/case_history/entities/case_history.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
@Directive('@key(fields:"id")')
export class Cases {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column({ nullable: true })
  @Field((type) => Int)
  lobid: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  desc: string;

  @Column({ nullable: true })
  @Field()
  statusid: number;

  @Column({ nullable: true })
  @Field()
  typeid: number;

  @Column('int', { array: true, nullable: true })
  @Field((type) => [Int], { nullable: true })
  linkedcases: number[];

  @Column({ nullable: true })
  @Field()
  creationdate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  completiondate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastmodificationdate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  penduntildate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  archivedate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  startuserid: number;

  @Column({ nullable: true })
  @Field()
  currentownerid: number;

  @Column('int', { array: true, nullable: true })
  @Field((type) => [Int], { nullable: true })
  involvedparties: number[];

  @Column({ nullable: true })
  @Field()
  isdeleted: boolean;


  // @OneToMany(()=>CaseHistory,casehistory =>casehistory.caseid)
  // @Field(type=>[CaseHistory],{nullable:true})
  // casehistory?:CaseHistory[];

  @OneToMany(() => CaseHistory, (casehistory) => casehistory.case)
  @Field(() => [CaseHistory], { nullable: true })
  casehistory: CaseHistory[]

}

@ObjectType()
export class casesResponse {
  @Field(type => [Cases])
  Cases: Cases[]

  @Field(type => Int)
  totalCount: number
}


