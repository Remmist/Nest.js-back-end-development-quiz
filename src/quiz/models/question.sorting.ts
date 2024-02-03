import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Quiz } from "./quiz";
import { AnswerSorting } from "./answer.sorting";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne  } from 'typeorm'

@Entity()
@ObjectType()
export class QuestionSorting{

  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number

  @ManyToOne(() => Quiz, (quiz) => quiz.questions_sorting)
  @Field(type => Quiz)
  quiz: Quiz

  @Column()
  @Field(type => String)
  description: string

  @OneToMany(() => AnswerSorting, (answer) => answer.question)
  @Field(type => [AnswerSorting])
  answers_sorting: AnswerSorting[]

}