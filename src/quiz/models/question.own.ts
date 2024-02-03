import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Quiz } from "./quiz";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne  } from 'typeorm'


@Entity()
@ObjectType()
export class QuestionOwn{


  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number

  @ManyToOne(() => Quiz, (quiz) => quiz.questions_own)
  @Field(type => Quiz)
  quiz: Quiz

  @Column()
  @Field(type => String)
  description: string

  @Column()
  @Field(type => String)
  answer: string
}