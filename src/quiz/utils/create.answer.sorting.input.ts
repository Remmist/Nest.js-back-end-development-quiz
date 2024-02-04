import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmptyObject, Matches, MaxLength, MinLength } from "class-validator";


@InputType()
export class CreateAnswerSortingInput{

  @MinLength(1)
  @MaxLength(200)
  @Field()
  description: string

  @Field(type => Int)
  place: number
}