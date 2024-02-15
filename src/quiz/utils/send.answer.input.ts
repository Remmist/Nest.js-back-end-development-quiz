import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn } from "class-validator";


@InputType()
export class SendAnswerInput {

  @Field(type => Int)
  question_id: number

  //single, multiple, sorting, own
  @IsIn(["single", "multiple", "sorting", "own"])
  @Field()
  question_type: string

  //single: 12
  @Field(type => Int, {nullable: true})
  single_answer?: number

  //multiple: ["Berlin", "Tokio"]
  @Field(type => [Int], {nullable: "itemsAndList"})
  multiple_answers?: [number]

  //sorting: [22, 31, 15, 52]. Must be provided in right sequence id's of answers
  @Field(type => [Int], {nullable: "itemsAndList"})
  sorting_answers?: [number]

  //question with own answer
  @Field({nullable: true})
  plain_text?: string
}