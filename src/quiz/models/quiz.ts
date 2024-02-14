import { Field, ObjectType, Int } from "@nestjs/graphql";
import { Question } from "./question";
import { QuestionOwn } from "./question.own";
import { QuestionSorting } from "./question.sorting";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity()
@ObjectType()
export class Quiz{

  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number

  @Column()
  @Field(type => String)
  name: string

  @OneToMany(() => Question, (question) => question.quiz, {eager: true})
  @Field(type => [Question], { nullable: 'itemsAndList' })
  questions?: Question[]

  @OneToMany(() => QuestionOwn, (question) => question.quiz, {eager: true})
  @Field(type => [QuestionOwn], { nullable: 'itemsAndList' })
  questions_own?: QuestionOwn[]

  @OneToMany(() => QuestionSorting, (question) => question.quiz, {eager: true})
  @Field(type => [QuestionSorting], { nullable: 'itemsAndList' })
  questions_sorting?: QuestionSorting[]
}

