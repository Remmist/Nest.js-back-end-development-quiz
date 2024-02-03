import { Field, Int, ObjectType } from "@nestjs/graphql";
import { QuestionSorting } from "./question.sorting";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne  } from 'typeorm'

@Entity()
@ObjectType()
export class AnswerSorting{

  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number

  @ManyToOne(() => QuestionSorting, (question) => question.answers_sorting)
  @Field(type => QuestionSorting)
  question: QuestionSorting

  @Column()
  @Field(type => String)
  description: string

  @Column()
  @Field(type => Int)
  place: number
}