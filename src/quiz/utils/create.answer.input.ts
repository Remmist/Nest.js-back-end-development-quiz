import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmptyObject, Matches, MaxLength, MinLength } from "class-validator";


@InputType()
export class CreateAnswerInput{

  @Matches(/.*[a-zA-Z].*/)
  @MinLength(3)
  @MaxLength(200)
  @Field()
  description: string

  @Field()
  is_correct: boolean
}