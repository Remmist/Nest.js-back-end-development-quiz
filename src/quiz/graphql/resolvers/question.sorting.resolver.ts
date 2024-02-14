import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { QuestionSorting } from "../../models/question.sorting";
import { QuizService } from "../../db/quiz.service";
import { AnswerSorting } from "../../models/answer.sorting";


@Resolver(of => QuestionSorting)
export class QuestionSortingResolver{

  constructor(private readonly quizService: QuizService) {}

  @ResolveField(returns => [AnswerSorting])
  async answers_sorting(@Parent() question: QuestionSorting){
    return await this.quizService.findAlLAnswersSorting(question)
  }

}