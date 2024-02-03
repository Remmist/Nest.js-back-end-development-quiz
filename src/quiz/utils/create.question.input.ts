import { Field, InputType } from "@nestjs/graphql";
import { CreateAnswerInput } from "./create.answer.input";
import { IsAlpha, IsNotEmpty } from "class-validator";


@InputType()
export class CreateQuestionInput{

  @IsAlpha()
  @Field()
  description: string

  @IsAlpha()
  @Field()
  type: string

  @Field(type => [CreateAnswerInput])
  answers: CreateAnswerInput[]
}