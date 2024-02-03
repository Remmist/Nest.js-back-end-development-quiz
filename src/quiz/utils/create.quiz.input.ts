import { Field, InputType } from "@nestjs/graphql";
import { CreateQuestionInput } from "./create.question.input";
import { CreateQuestionOwnInput } from "./create.question.own.input";
import { CreateQuestionSortingInput } from "./create.question.sorting.input";
import { IsAlpha, IsNotEmpty } from "class-validator";


@InputType()
export class CreateQuizInput{

  @IsAlpha()
  @Field()
  name: string

  @Field(type => [CreateQuestionInput], { nullable: 'itemsAndList' })
  questions?: CreateQuestionInput[]

  @Field(type => [CreateQuestionOwnInput], { nullable: 'itemsAndList' })
  questions_own?: CreateQuestionOwnInput[]

  @Field(type => [CreateQuestionSortingInput], { nullable: 'itemsAndList' })
  questions_sorting?: CreateQuestionSortingInput[]
}