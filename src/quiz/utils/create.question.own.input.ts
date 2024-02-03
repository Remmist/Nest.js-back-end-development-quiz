import { Field, InputType } from "@nestjs/graphql";
import { CreateAnswerInput } from "./create.answer.input";
import { IsAlpha, IsNotEmpty } from "class-validator";


@InputType()
export class CreateQuestionOwnInput{

  @IsAlpha()
  @Field()
  description: string

  @Field()
  answer: string
}