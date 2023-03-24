import { Field, ObjectType, Directive, ID } from '@nestjs/graphql';
import { CaseHistory } from 'src/case_history/entities/case_history.entity';
import { EventTypes } from 'src/event_types/entities/event_type.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

/**
 * Summary :  Entity Class For Case events
 * Created By : Akhila U S
 */
@Entity()
@ObjectType()
@Directive('@key(fields:"id")')
export class CaseEvents {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  eventtypeId: number;

  @Column({ nullable: true })
  @Field()
  artifactId: number;

  @OneToMany(() => CaseHistory, (casehistory) => casehistory.event)
  @Field(() => [CaseHistory], { nullable: true })
  casehistory: CaseHistory[];

  @ManyToOne(() => EventTypes, (eventtype) => eventtype.caseevent)
  @Field(() => EventTypes, { nullable: true })
  eventtype: EventTypes;
}
