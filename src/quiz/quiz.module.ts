import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./models/quiz";
import { Question } from "./models/question";
import { QuestionOwn } from "./models/question.own";
import { QuestionSorting } from "./models/question.sorting";
import { Answer } from "./models/answer";
import { AnswerSorting } from "./models/answer.sorting";


@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question, QuestionOwn, QuestionSorting, Answer, AnswerSorting]),
  ]
})
export class QuizModule {}