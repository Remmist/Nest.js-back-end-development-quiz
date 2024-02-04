import { Field, InputType, Int } from "@nestjs/graphql";
import { SendAnswerInput } from "./send.answer.input";
import { IsNotEmpty } from "class-validator";


@InputType()
export class SendAnswersInput {

  @Field(type => Int)
  quiz_id: number


  @Field( type => [SendAnswerInput],{nullable: "itemsAndList"})
  answers?: [SendAnswerInput]

}