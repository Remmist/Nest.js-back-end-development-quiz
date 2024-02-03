import { Field, InputType, Int } from "@nestjs/graphql";
import { Answer } from "../models/answer";
import { IsAlpha } from "class-validator";


@InputType()
export class CreateAnswerSortingInput{

  @IsAlpha()
  @Field()
  description: string

  @Field(type => Int)
  place: number
}