import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Quiz } from "./quiz";
import { Answer } from "./answer";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne  } from 'typeorm'

@Entity()
@ObjectType()
export class Question{

  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz

  @Column()
  @Field(type => String)
  description: string

  //single or multiple
  @Column()
  @Field(type => String)
  type: string

  @OneToMany(() => Answer, (answer) => answer.question, {eager: true})
  @Field(type => [Answer])
  answers: Answer[]
}