import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import { Repository, EntityManager } from 'typeorm'
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

    private readonly entityManager: EntityManager,

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


  async createQuiz(quiz_input: CreateQuizInput){

    //Checks that the provided answers make sense
    quiz_input.questions.forEach(function(question){
      const checker = question.answers.filter(x => x.is_correct)
      if (checker.length != 1 && question.type === "single"){
        throw new Error("Provided answers for question with single correct answer contains more or less than 1 correct answer. Question - " + question.description)
      } else if (checker.length <= 1 && question.type === "multiple"){
        throw new Error("Provided answers for question with multiple correct answers doesnt contains at least 2 correct answers. Question - " + question.description)
      }
    })

    quiz_input.questions_sorting.forEach(function(question){
      question.answers_sorting.forEach(function(answer){
        if (answer.place <= 0){
          throw new Error("Sorting answer place in sequence is less than or equal to 0. Question - " + question.description + ", answer - " + answer.description)
        }
        if(question.answers_sorting.length - answer.place < 0){
          throw new Error("Sorting answer place in sequence is more than length of sequence. Question - " + question.description + ", answer - " + answer.description)
        }
        const checker = question.answers_sorting.filter(x => x.place === answer.place)
        if(checker.length != 1){
          throw new Error("Sorting answer place in sequence is not unique. Question - " + question.description + ", answer - " + answer.description)
        }
      })
    })

    let result: Quiz = null
    await this.entityManager.transaction(async (entityManager) => {

      const created_quiz = this.quizRepository.create(quiz_input)
      const quiz = await entityManager.save(created_quiz)

      for(let i = 0; i < quiz.questions.length; i++){

        const created_question = this.questionRepository.create(quiz.questions[i])
        created_question.quiz = quiz

        const question = await entityManager.save(created_question)

        for(let j = 0; j < question.answers.length; j++){
          const created_answer = this.answerRepository.create(question.answers[j])
          created_answer.question = question

          await entityManager.save(created_answer)
        }
      }

      for(let i = 0; i < quiz.questions_sorting.length; i++){

        const created_question = this.questionSortingRepository.create(quiz.questions_sorting[i])
        created_question.quiz = quiz

        const question = await entityManager.save(created_question)

        for(let j = 0; j < question.answers_sorting.length; j++){
          const created_answer = this.answerSortingRepository.create(question.answers_sorting[j])
          created_answer.question = question

          await entityManager.save(created_answer)
        }
      }

      for(let i = 0; i < quiz.questions_own.length; i++){
        const created_question = this.questionOwnRepository.create(quiz.questions_own[i])
        created_question.quiz = quiz

        await entityManager.save(created_question)
      }

      result = quiz
    })

    return result
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