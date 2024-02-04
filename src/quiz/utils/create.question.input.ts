import { Field, InputType } from "@nestjs/graphql";
import { CreateAnswerInput } from "./create.answer.input";
import { IsAlpha, IsIn, Matches, MaxLength, MinLength } from "class-validator";


@InputType()
export class CreateQuestionInput{

  @Matches(/.*[a-zA-Z].*/)
  @MinLength(3)
  @MaxLength(200)
  @Field()
  description: string

  @IsIn(["single", "multiple"])
  @Field()
  type: string

  @Field(type => [CreateAnswerInput])
  answers: CreateAnswerInput[]
}