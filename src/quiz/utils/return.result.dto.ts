import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class ReturnResultDto{

  @Field(type => Int)
  max_result: number

  @Field(type => Int)
  your_result: number
}