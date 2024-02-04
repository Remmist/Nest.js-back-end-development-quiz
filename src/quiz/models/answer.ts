import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Question } from "./question";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne  } from 'typeorm'


@Entity()
@ObjectType()
export class Answer{

  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number

  @ManyToOne(() => Question, (question) => question.answers)
  // @Field(type => Question)
  question: Question

  @Column()
  @Field(type => String)
  description: string

  @Column()
  @Field(type => Boolean)
  is_correct: boolean

}