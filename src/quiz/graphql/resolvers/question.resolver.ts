import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { Question } from "../../models/question";
import { QuizService } from "../../db/quiz.service";
import { Answer } from "../../models/answer";


@Resolver(of => Question)
export class QuestionResolver{

  constructor(private readonly quizService: QuizService) {}

  @ResolveField(returns => [Answer])
  async answers(@Parent() question: Question){
    return await this.quizService.findAlLAnswers(question)
  }

}