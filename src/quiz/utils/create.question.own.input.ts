import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmptyObject, Matches, MaxLength, MinLength } from "class-validator";


@InputType()
export class CreateQuestionOwnInput{

  @Matches(/.*[a-zA-Z].*/)
  @MinLength(3)
  @MaxLength(200)
  @Field()
  description: string

  @MinLength(1)
  @MaxLength(200)
  @Field()
  answer: string
}