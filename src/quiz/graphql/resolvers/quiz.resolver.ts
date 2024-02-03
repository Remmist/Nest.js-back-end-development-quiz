import { Resolver, Query, Args, Int, ResolveField, Parent, Mutation } from "@nestjs/graphql";
import { Quiz } from "../../models/quiz";
import { QuestionSorting } from "../../models/question.sorting";
import { Question } from "../../models/question";
import { QuizService } from "../../db/quiz.service";
import { QuestionOwn } from "../../models/question.own";
import { CreateQuizInput } from "../../utils/create.quiz.input";
import { AnswerSorting } from "../../models/answer.sorting";
import { Answer } from "../../models/answer";
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
    const questions = await this.quizService.findAlLQuestions(quiz)

    for (let i = 0; i < questions.length; i++){
      questions[i].answers = await this.quizService.findAlLAnswers(questions[i])
    }

    return questions
  }

  @ResolveField(returns => [QuestionOwn], {nullable: true})
  questions_own(@Parent() quiz: Quiz){
    return this.quizService.findAlLQuestionsOwn(quiz)
  }

  @ResolveField(returns => [QuestionSorting], {nullable: true})
  async questions_sorting(@Parent() quiz: Quiz){
    const questions = await this.quizService.findAlLQuestionsSorting(quiz)

    for(let i = 0; i < questions.length; i++){
      questions[i].answers_sorting = await this.quizService.findAlLAnswersSorting(questions[i])
    }

    return questions
  }



  //FOR SOME REASON NOT WORKING

  // @ResolveField(returns => [AnswerSorting])
  // answers_sorting(@Parent() question: QuestionSorting){
  //   return this.quizService.findAlLAnswersSorting(question)
  // }
  //
  // @ResolveField(returns => [Answer])
  // answers(@Parent() question: Question){
  //   console.log("JA TUT BYL")
  //   return this.quizService.findAlLAnswers(question)
  // }


  @Mutation(returns => Quiz)
  async createQuiz(
    @Args('createQuizInput') quiz: CreateQuizInput
  ){
    return await this.quizService.createQuiz(quiz)
  }

}