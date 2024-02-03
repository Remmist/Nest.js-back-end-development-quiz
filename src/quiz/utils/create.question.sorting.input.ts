import { Field, InputType } from "@nestjs/graphql";
import { CreateAnswerSortingInput } from "./create.answer.sorting.input";
import { IsAlpha, IsNotEmpty } from "class-validator";


@InputType()
export class CreateQuestionSortingInput{

  @IsAlpha()
  @Field()
  description: string

  @Field(type => [CreateAnswerSortingInput])
  answers: CreateAnswerSortingInput[]
}