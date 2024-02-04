import { Field, InputType } from "@nestjs/graphql";
import { CreateAnswerSortingInput } from "./create.answer.sorting.input";
import { Matches, MaxLength, MinLength } from "class-validator";


@InputType()
export class CreateQuestionSortingInput{

  @Matches(/.*[a-zA-Z].*/)
  @MinLength(3)
  @MaxLength(200)
  @Field()
  description: string

  @Field(type => [CreateAnswerSortingInput])
  answers_sorting: CreateAnswerSortingInput[]
}