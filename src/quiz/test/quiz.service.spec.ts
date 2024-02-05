import { Test } from '@nestjs/testing';
import { QuizService } from "../db/quiz.service";
import { Quiz } from "../models/quiz";
import { Connection, Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Question } from "../models/question";
import { QuestionSorting } from "../models/question.sorting";
import { QuestionOwn } from "../models/question.own";
import { Answer } from "../models/answer";
import { AnswerSorting } from "../models/answer.sorting";
import { CreateQuizInput } from "../utils/create.quiz.input";

describe('QuizService', () => {
  let quizService: QuizService;
  let quizRepository: Repository<Quiz>;

  let questionRepository: Repository<Question>;
  let questionSortingRepository: Repository<QuestionSorting>;
  let questionOwnRepository: Repository<QuestionOwn>;
  let answerRepository: Repository<Answer>;
  let answerSortingRepository: Repository<AnswerSorting>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: getRepositoryToken(Quiz),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Question),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Answer),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(QuestionSorting),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AnswerSorting),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(QuestionOwn),
          useValue: {
            find: jest.fn(),
          },
        },

        {
          provide: Connection,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          }
        }

        // Продолжайте добавлять моки для остальных репозиториев, аналогично quizRepository
      ]
    }).compile();

    quizService = moduleRef.get<QuizService>(QuizService);
    quizRepository = moduleRef.get<Repository<Quiz>>(getRepositoryToken(Quiz));

    questionRepository = moduleRef.get<Repository<Question>>(getRepositoryToken(Question));
    questionSortingRepository = moduleRef.get<Repository<QuestionSorting>>(getRepositoryToken(QuestionSorting));
    questionOwnRepository = moduleRef.get<Repository<QuestionOwn>>(getRepositoryToken(QuestionOwn));
    answerRepository = moduleRef.get<Repository<Answer>>(getRepositoryToken(Answer));
    answerSortingRepository = moduleRef.get<Repository<AnswerSorting>>(getRepositoryToken(AnswerSorting));
  });

  describe('findQuiz', () => {
    it('should return a quiz', async () => {
      const expectedQuiz = { id: 1, name: "test" };

      jest.spyOn(quizRepository, 'findOne').mockResolvedValue(expectedQuiz);

      const result = await quizService.findQuiz(1);

      expect(result).toEqual(expectedQuiz);
      expect(quizRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });


  describe('findAllQuestions', () => {
    it('should return all questions for a quiz', async () => {
      const quiz = new Quiz();
      quiz.id = 1;
      const expectedQuestions = [new Question(), new Question()];

      jest.spyOn(questionRepository, 'find').mockResolvedValue(expectedQuestions);

      const result = await quizService.findAlLQuestions(quiz);
      expect(result).toEqual(expectedQuestions);
      expect(questionRepository.find).toHaveBeenCalledWith({
        where: { quiz: quiz },
      });
    });
  });

  describe('findAllAnswers', () => {
    it('should return all answers for a question', async () => {
      const question = new Question();
      question.id = 1;
      const expectedAnswers = [new Answer(), new Answer()];

      jest.spyOn(answerRepository, 'find').mockResolvedValue(expectedAnswers);

      const result = await quizService.findAlLAnswers(question);
      expect(result).toEqual(expectedAnswers);
      expect(answerRepository.find).toHaveBeenCalledWith({
        where: { question: question },
      });
    });
  });

  describe('findAlLQuestionsSorting', () => {
    it('should return all questions sorting for a quiz', async () => {
      const quiz = new Quiz();
      quiz.id = 1;
      const expectedQuestions = [new QuestionSorting(), new QuestionSorting()];

      jest.spyOn(questionSortingRepository, 'find').mockResolvedValue(expectedQuestions);

      const result = await quizService.findAlLQuestionsSorting(quiz);
      expect(result).toEqual(expectedQuestions);
      expect(questionSortingRepository.find).toHaveBeenCalledWith({
        where: { quiz: quiz },
      });
    });
  });

  describe('findAlLAnswersSorting', () => {
    it('should return all answers sorting for a question sorting', async () => {
      const question = new QuestionSorting();
      question.id = 1;
      const expectedAnswers = [new AnswerSorting(), new AnswerSorting()];

      jest.spyOn(answerSortingRepository, 'find').mockResolvedValue(expectedAnswers);

      const result = await quizService.findAlLAnswersSorting(question);
      expect(result).toEqual(expectedAnswers);
      expect(answerSortingRepository.find).toHaveBeenCalledWith({
        where: { question: question },
      });
    });
  });

  describe('findAlLQuestionsOwn', () => {
    it('should return all questions own for a quiz', async () => {
      const quiz = new Quiz();
      quiz.id = 1;
      const expectedQuestions = [new QuestionOwn(), new QuestionOwn()];

      jest.spyOn(questionOwnRepository, 'find').mockResolvedValue(expectedQuestions);

      const result = await quizService.findAlLQuestionsOwn(quiz);
      expect(result).toEqual(expectedQuestions);
      expect(questionOwnRepository.find).toHaveBeenCalledWith({
        where: { quiz: quiz },
      });
    });
  });

});