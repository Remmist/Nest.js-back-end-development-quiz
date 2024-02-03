import { Field, InputType } from "@nestjs/graphql";
import { IsAlpha } from "class-validator";


@InputType()
export class CreateAnswerInput{
  @IsAlpha()
  @Field()
  description: string

  @Field()
  is_correct: boolean
}