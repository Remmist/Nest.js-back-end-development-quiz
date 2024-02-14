import { Resolver, Query, Args, Int, ResolveField, Parent, Mutation } from "@nestjs/graphql";
import { Quiz } from "../../models/quiz";
import { QuestionSorting } from "../../models/question.sorting";
import { Question } from "../../models/question";
import { QuizService } from "../../db/quiz.service";
import { QuestionOwn } from "../../models/question.own";
import { CreateQuizInput } from "../../utils/create.quiz.input";
import { SendAnswersInput } from "../../utils/send.answers.input";
import { ReturnResultDto } from "../../utils/return.result.dto";


@Resolver(of => Quiz)
export class QuizResolver{

  constructor(private readonly quizService: QuizService) {}

  @Query(returns => Quiz, {nullable: true})
  async getQuiz(
    @Args("id", {type: () => Int}) id: number
  ){
    return await this.quizService.findQuiz(id)
  }

  @Query(returns => ReturnResultDto)
  async sendAnswers(
    @Args('sendAnswersInput') answers: SendAnswersInput
  ){
    return await this.quizService.checkAnswers(answers)
  }


  @ResolveField(returns => [Question], {nullable: true})
  async questions(@Parent() quiz: Quiz){
    return await this.quizService.findAlLQuestions(quiz)
  }

  @ResolveField(returns => [QuestionOwn], {nullable: true})
  async questions_own(@Parent() quiz: Quiz){
    return await this.quizService.findAlLQuestionsOwn(quiz)
  }

  @ResolveField(returns => [QuestionSorting], {nullable: true})
  async questions_sorting(@Parent() quiz: Quiz){
    return await this.quizService.findAlLQuestionsSorting(quiz)
  }


  @Mutation(returns => Quiz)
  async createQuiz(
    @Args('createQuizInput') quiz: CreateQuizInput
  ){
    return await this.quizService.createQuiz(quiz)
  }

}