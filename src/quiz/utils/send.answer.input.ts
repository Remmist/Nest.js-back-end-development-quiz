import { Field, InputType, Int } from "@nestjs/graphql";
import { IsAlpha, IsNotEmpty } from "class-validator";


@InputType()
export class SendAnswerInput {

  @Field(type => Int)
  question_id: number

  //single, multiple, sorting
  @IsNotEmpty()
  @IsAlpha()
  @Field()
  question_type: string

  //single: "1"
  @Field({nullable: true})
  single_answer?: string

  //multiple: ["Berlin", "Tokio"]
  @Field(type => [String],{nullable: "itemsAndList"})
  multiple_answers?: [string]

  //sorting: [22, 31, 15, 52]. Must be provided in right sequence id's of answers
  @Field(type => [Int],{nullable: "itemsAndList"})
  sorting_answers?: [number]
}