import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository, Connection} from 'typeorm'
import { Quiz } from "../models/quiz";
import { Question } from "../models/question";
import { QuestionSorting } from "../models/question.sorting";
import { QuestionOwn } from "../models/question.own";
import { Answer } from "../models/answer";
import { AnswerSorting } from "../models/answer.sorting";
import { CreateQuizInput } from "../utils/create.quiz.input";
import { SendAnswersInput } from "../utils/send.answers.input";
import { ReturnResultDto } from "../utils/return.result.dto";

@Injectable()
export class QuizService{

  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(QuestionSorting)
    private readonly questionSortingRepository: Repository<QuestionSorting>,

    @InjectRepository(QuestionOwn)
    private readonly questionOwnRepository: Repository<QuestionOwn>,

    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    @InjectRepository(AnswerSorting)
    private readonly answerSortingRepository: Repository<AnswerSorting>,

    private readonly connection: Connection
  ) {}


  async findQuiz(id: number){
    return await this.quizRepository.findOne({
      where :{
        id: id
      }
    })
  }


  async findAlLQuestions(quiz: Quiz){
    return await this.questionRepository.find({
      where: {
        quiz: quiz
      }
    })
  }

  async findAlLAnswers(question: Question){
    return await this.answerRepository.find({
      where: {
        question: question
      }
    })
  }

  async findAlLQuestionsSorting(quiz: Quiz){
    return await this.questionSortingRepository.find({
      where: {
        quiz: quiz
      }
    })
  }

  async findAlLAnswersSorting(question: QuestionSorting){
    return await this.answerSortingRepository.find({
      where: {
        question: question
      }
    })
  }

  async findAlLQuestionsOwn(quiz: Quiz){
    return await this.questionOwnRepository.find({
      where: {
        quiz: quiz
      }
    })
  }


  async createQuiz(quiz: CreateQuizInput){
    const queryRunner = this.connection.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{

      const tmpquiz = await this.quizRepository.save(quiz)

      //saving questions(single and multiple) + answers to them
      for(let i = 0; i < quiz.questions.length; i++){
        const questiontmp = this.questionRepository.create(quiz.questions[i])
        questiontmp.quiz = tmpquiz
        await this.questionRepository.save(questiontmp)
        for(let j = 0; j < quiz.questions[i].answers.length; j++){
          const answertmp = this.answerRepository.create(quiz.questions[i].answers[j])
          answertmp.question = questiontmp
          await this.answerRepository.save(answertmp)
        }
      }

      //saving questions(own answer)
      for(let i = 0; i < quiz.questions_own.length; i++){
        const questiontmp = this.questionOwnRepository.create(quiz.questions_own[i])
        questiontmp.quiz = tmpquiz
        await this.questionOwnRepository.save(questiontmp)
      }

      //saving sorting questions + answers to them
      for(let i = 0; i < quiz.questions_sorting.length; i++){
        const questiontmp = this.questionSortingRepository.create(quiz.questions_sorting[i])
        questiontmp.quiz = tmpquiz
        await this.questionSortingRepository.save(questiontmp)
        for(let j = 0; j < quiz.questions_sorting[i].answers.length; j++){
          const answertmp = this.answerSortingRepository.create(quiz.questions_sorting[i].answers[j])
          answertmp.question = questiontmp
          await this.answerSortingRepository.save(answertmp)
        }
      }
      await queryRunner.commitTransaction();
      return tmpquiz
    } catch (error){
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async checkAnswers(answers: SendAnswersInput){
    //Finding quiz and questions with answers to them
    const quiz = await this.quizRepository.findOne({
      where: {
        id: answers.quiz_id
      }
    })

    quiz.questions_own = await this.findAlLQuestionsOwn(quiz)
    quiz.questions = await this.findAlLQuestions(quiz)
    quiz.questions_sorting = await this.findAlLQuestionsSorting(quiz)

    for(let i = 0; i < quiz.questions.length; i++){
      quiz.questions[i].answers = await this.findAlLAnswers(quiz.questions[i])
    }

    for(let i = 0; i < quiz.questions_sorting.length; i++){
      quiz.questions_sorting[i].answers_sorting = await this.findAlLAnswersSorting(quiz.questions_sorting[i])
    }

    //Sum of all questions. For each question 1 point
    let max_points = quiz.questions_own.length + quiz.questions.length + quiz.questions_sorting.length
    let your_result = 0

    for (let i = 0; i < answers.answers.length; i++){
      const answer = answers.answers[i]

      if(answer.question_type === "single"){

        const question = quiz.questions.find(question => question.id === answer.question_id)
        const correct_answer = question.answers.find(correct => correct.is_correct)

        if(correct_answer.description === answer.single_answer){
          your_result++
        }

      } else if(answer.question_type === "multiple"){

        const question = quiz.questions.find(question => question.id === answer.question_id)
        const correct_answers = question.answers.filter(correct => correct.is_correct)
        const check_answers_array = []

        for(let j = 0; j < correct_answers.length; j++){
          check_answers_array.push(correct_answers[j].description)
        }

        if(correct_answers.length != answer.multiple_answers.length){
          continue
        }

        const isSame = check_answers_array.length === answer.multiple_answers.length &&
          check_answers_array.every(value => answer.multiple_answers.includes(value));

        if(isSame){
          your_result += check_answers_array.length
        }
      } else if(answer.question_type === "sorting") {

        const question = quiz.questions_sorting.find(question => question.id === answer.question_id)
        const question_answers = question.answers_sorting

        question_answers.sort((a, b) => a.place - b.place)

        let student_sequence = ""
        let correct_sequence = ""
        question_answers.forEach((element) =>{
          correct_sequence+=element.id
        })

        answer.sorting_answers.forEach((element) =>{
          student_sequence+=element
        })

        if(student_sequence === correct_sequence){
          your_result++
        }

      } else {
        const question = quiz.questions_own.find(question => question.id === answer.question_id)

        if(question.answer === answer.single_answer){
          your_result++
        }

      }

    }

    const result = new ReturnResultDto()
    result.your_result = your_result
    result.max_result = max_points

    return result
  }



}