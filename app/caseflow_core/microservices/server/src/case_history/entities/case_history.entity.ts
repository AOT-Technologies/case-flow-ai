import { Field, ObjectType, Int ,Directive,ID } from '@nestjs/graphql';
import { Cases } from 'src/cases/cases.entity';
import { CaseEvents } from 'src/case_events/entities/case_event.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@ObjectType()

export class CaseHistory {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column({ nullable: true })
  @Field((type) => Int)
  datetime: number;

  @Column()
  @Field()
  outcome: string;

  @Column({ nullable: true })
  @Field()
  userid: number;



  
  @Column({ nullable: true })
  @Field()
  eventId: number;



  @ManyToOne(() => CaseEvents, (event) => event.casehistory)
  @Field(() => CaseEvents, { nullable: true })
  @JoinColumn({name: 'eventId'})
  event: CaseEvents;


  @ManyToOne(() => Cases, (cases) => cases.casehistory)
  @Field(() => Cases, { nullable: true })
  case: Cases;



  @Column({ nullable: true })
  @Field({ nullable: true })
  caseId: number;
}