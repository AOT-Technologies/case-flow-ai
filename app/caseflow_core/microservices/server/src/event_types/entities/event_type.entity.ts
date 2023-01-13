import { Field, ObjectType, Int ,Directive,ID } from '@nestjs/graphql';
import { CaseEvents } from 'src/case_events/entities/case_event.entity';
import { CaseHistory } from 'src/case_history/entities/case_history.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
@Directive('@key(fields:"id")')
export class EventTypes {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  text: string;

  @Column({ nullable: true })
  @Field()
  code: number;



  @OneToMany(() => CaseEvents, (caseevent) => caseevent.eventtype)
  @Field(() => [CaseEvents], { nullable: true })
  caseevent: CaseEvents[]
}
