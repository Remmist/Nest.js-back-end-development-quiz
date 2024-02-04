import { Field, InputType } from "@nestjs/graphql";
import { CreateQuestionInput } from "./create.question.input";
import { CreateQuestionOwnInput } from "./create.question.own.input";
import { CreateQuestionSortingInput } from "./create.question.sorting.input";
import { Matches, MaxLength, MinLength } from "class-validator";


@InputType()
export class CreateQuizInput{

  @Matches(/.*[a-zA-Z].*/)
  @MinLength(3)
  @MaxLength(200)
  @Field()
  name: string

  @Field(type => [CreateQuestionInput], { nullable: 'itemsAndList' })
  questions?: CreateQuestionInput[]

  @Field(type => [CreateQuestionOwnInput], { nullable: 'itemsAndList' })
  questions_own?: CreateQuestionOwnInput[]

  @Field(type => [CreateQuestionSortingInput], { nullable: 'itemsAndList' })
  questions_sorting?: CreateQuestionSortingInput[]
}