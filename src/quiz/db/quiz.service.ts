import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import { Repository, DataSource } from 'typeorm'
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

    private readonly dataSource: DataSource,

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
    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{

      const tmpquiz: Quiz = await this.quizRepository.save(quiz)

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
        for(let j = 0; j < quiz.questions_sorting[i].answers_sorting.length; j++){
          const answertmp = this.answerSortingRepository.create(quiz.questions_sorting[i].answers_sorting[j])
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

    answers.answers.forEach(function(element){
      const filter = answers.answers.filter(x => x.question_id === element.question_id)
      if (filter.length >= 2){
        throw new Error("Answers doesnt contains unique question_id = " + filter[0].question_id)
      }
    })


    //Finding quiz
    const quiz = await this.quizRepository.findOne({
      where: {
        id: answers.quiz_id
      }
    })

    if(quiz === null || quiz === undefined){
      throw new Error("A quiz with id = " + answers.quiz_id + " does not exist")
    }

    //Sum of all questions. For each question 1 point
    let max_points = quiz.questions_own.length + quiz.questions.length + quiz.questions_sorting.length
    let your_result = 0


    answers.answers.forEach(function(answer){

      if(answer.question_type === "single"){

        const question = quiz.questions.find(element => element.id == answer.question_id)

        if(question === null || question === undefined || question.type != answer.question_type){
          throw new Error("A question of type |" + answer.question_type + "| with id = " + answer.question_id + " does not exist")
        }
        if(answer.single_answer === null || answer.single_answer === undefined){
          throw new Error("Answer for question of type |" + answer.question_type + "| with id = " + answer.question_id + " is not provided")
        }

        const correct_answer = question.answers.find(element => element.is_correct)

        if (correct_answer.id === answer.single_answer){
          your_result++
        }
      } else if (answer.question_type === "multiple"){

        const question = quiz.questions.find(element => element.id == answer.question_id)

        if(question === null || question === undefined || question.type != answer.question_type){
          throw new Error("A question of type |" + answer.question_type + "| with id = " + answer.question_id + " does not exist")
        }
        if(answer.multiple_answers === null || answer.multiple_answers === undefined){
          throw new Error("Answers for question of type |" + answer.question_type + "| with id = " + answer.question_id + " is not provided")
        }

        const correct_answers = question.answers.filter(element => element.is_correct)

        const isSame = correct_answers.length === answer.multiple_answers.length &&
          correct_answers.every(value => answer.multiple_answers.includes(value.id));

        if(isSame){
          your_result++
        }

      } else if (answer.question_type === "sorting"){

        const question = quiz.questions_sorting.find(element => element.id == answer.question_id)

        if(question === null || question === undefined){
          throw new Error("A question of type |" + answer.question_type + "| with id = " + answer.question_id + " does not exist")
        }
        if(answer.sorting_answers === null || answer.sorting_answers === undefined){
          throw new Error("Answers for question of type |" + answer.question_type + "| with id = " + answer.question_id + " is not provided")
        }

        const correct_answers = question.answers_sorting

        correct_answers.sort((a, b) => a.place - b.place)

        let student_sequence = ""
        let correct_sequence = ""
        correct_answers.forEach((element) =>{
          correct_sequence+=element.id
        })

        answer.sorting_answers.forEach((element) =>{
          student_sequence+=element
        })

        if(student_sequence === correct_sequence){
          your_result++
        }

      } else if (answer.question_type === "own"){

        const question = quiz.questions_own.find(element => element.id == answer.question_id)

        if(question === null || question === undefined){
          throw new Error("A question of type |" + answer.question_type + "| with id = " + answer.question_id + " does not exist")
        }
        if(!answer.plain_text){
          throw new Error("Answer for question of type |" + answer.question_type + "| with id = " + answer.question_id + " is not provided")
        }

        const correct_answer = question.answer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(" ", "")
        const provided_answer = answer.plain_text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(" ", "")

        if(correct_answer === provided_answer){
          your_result++
        }

      }

    })


    const result = new ReturnResultDto()
    result.your_result = your_result
    result.max_result = max_points

    return result
  }



}