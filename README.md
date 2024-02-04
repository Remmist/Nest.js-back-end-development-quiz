
# Backend API based on NestJS and GraphQL for quiz app

Backend API for quiz application written based on NestJS framework using GraphQL. This API has the following functions:

* Create a new quiz. You can create a new quiz using mutation, which will enter all the data into the database.

* Get questions for a quiz. You can get all the required questions from the quiz using query, along with their answer choices.

* Check answers. You can also check all your answers to the quiz, getting the result at the end in the form of the maximum possible points and your scored points. Points are counted for each question where all correct answers are selected.

(Examples will be below)
## How to start the application?

1.	First, you need to install docker to run the database container. https://docs.docker.com/desktop/install/windows-install/
2.	You need to install NestJS. Instructions on how to install the NestJS: 
https://docs.nestjs.com/first-steps

3.	Next, you need to create database containers in docker. You can do this by opening the terminal or console in the project directory and write the following command: 
```console
docker-compose up -d –build
```
4.	You need to create a database using pgAdmin. You can open it by clicking this button in docker desktop or by going to the following address: http://127.0.0.1:5050/browser/

5.	Once the installation process is complete, you can run the following command at your OS command prompt (opened in the project directory) to start the application:
```console
nest start
```
6.	Once the app is running, you can click on the link: http://localhost:3000/graphql and enter your queries or mutations according to the scheme, to verify operation.

## Examples of GraphQL queries and mutations:

### Create a new quiz:
```graphql
mutation CreateQuiz($quiz: CreateQuizInput!) {
  createQuiz(createQuizInput: $quiz){
    id
    name
    questions{
      description
      answers{
        description
      }
    }
    questions_sorting{
      description
      answers_sorting{
        description
      }
    }
    questions_own{
      description
    }
  }
}
```
Variables:
```graphql
{
  "quiz": {
    "name": "Full work test quiz",
    "questions": [
      
      {
        "description": "What is the capital of France?",
        "type": "single",
        "answers": [
          
          {
            "description": "Madrid",
            "is_correct": false
          },
          
          {
            "description": "Berlin",
            "is_correct": false
          },
          
          {
            "description": "Paris",
            "is_correct": true
          },
          
          {
            "description": "Rome",
            "is_correct": false
          }
          
        ]
      },
      
      {
        "description": "Which of the following are prime numbers?",
        "type": "multiple",
        "answers": [
          
          {
            "description": "15",
            "is_correct": false
          },
          
          {
            "description": "7",
            "is_correct": true
          },
          
          {
            "description": "12",
            "is_correct": false
          },
          
          {
            "description": "11",
            "is_correct": true
          }
          
        ]
      }
      
    ],
    "questions_own": [
      
      {
        "description": "Who wrote Romeo and Juliet?",
        "answer": "William Shakespeare"
      },
      
      {
        "description": "What is the capital of Canada?",
        "answer": "Ottawa"
      }
      
    ],
    "questions_sorting": [
      
      {
        "description": "Arrange the following historical events in chronological order:",
        "answers_sorting": [
          
          {
            "description": "Discovery of America by Christopher Columbus",
            "place": 2
          },
          
          {
            "description": "Signing of the Declaration of Independence",
            "place": 3
          },
          
          {
            "description": "French Revolution",
            "place": 4
          },
          
          {
            "description": "Invention of the printing press by Johannes Gutenberg",
            "place": 1
          }
          
        ]
      },
      
      {
        "description": "Put the following steps in the correct order for baking a cake:",
        "answers_sorting": [
          
          {
            "description": "Preheat the oven",
            "place": 3
          },
          
          {
            "description": "Mix the ingredients",
            "place": 1
          },
          
          {
            "description": "Pour the batter into a greased pan",
            "place": 2
          },
          
          {
            "description": "Bake in the oven",
            "place": 4
          }
          
        ]
      }
    
      
    ]
  }
}
```
Answer
```graphql
{
  "data": {
    "createQuiz": {
      "id": 25,
      "name": "Full work test quiz",
      "questions": [
        {
          "description": "What is the capital of France?",
          "answers": [
            {
              "description": "Madrid"
            },
            {
              "description": "Berlin"
            },
            {
              "description": "Paris"
            },
            {
              "description": "Rome"
            }
          ]
        },
        {
          "description": "Which of the following are prime numbers?",
          "answers": [
            {
              "description": "15"
            },
            {
              "description": "7"
            },
            {
              "description": "12"
            },
            {
              "description": "11"
            }
          ]
        }
      ],
      "questions_sorting": [
        {
          "description": "Arrange the following historical events in chronological order:",
          "answers_sorting": [
            {
              "description": "Discovery of America by Christopher Columbus"
            },
            {
              "description": "Signing of the Declaration of Independence"
            },
            {
              "description": "French Revolution"
            },
            {
              "description": "Invention of the printing press by Johannes Gutenberg"
            }
          ]
        },
        {
          "description": "Put the following steps in the correct order for baking a cake:",
          "answers_sorting": [
            {
              "description": "Preheat the oven"
            },
            {
              "description": "Mix the ingredients"
            },
            {
              "description": "Pour the batter into a greased pan"
            },
            {
              "description": "Bake in the oven"
            }
          ]
        }
      ],
      "questions_own": [
        {
          "description": "Who wrote Romeo and Juliet?"
        },
        {
          "description": "What is the capital of Canada?"
        }
      ]
    }
  }
}
```


### Get questions for a quiz:
```graphql
query{
  getQuiz(id: 14){
    name
    questions{
      id
      type
      description
      answers{
        id
        description
      }
    }
    questions_own{
      id
      description
    }
    questions_sorting{
      id
      description
      answers_sorting{
        id
        description
      }
    }
  }
}
```
Answer
```graphql
{
  "data": {
    "getQuiz": {
      "name": "Full work test quiz",
      "questions": [
        {
          "id": 12,
          "type": "single",
          "description": "What is the capital of France?",
          "answers": [
            {
              "id": 19,
              "description": "Madrid"
            },
            {
              "id": 20,
              "description": "Berlin"
            },
            {
              "id": 21,
              "description": "Paris"
            },
            {
              "id": 22,
              "description": "Rome"
            }
          ]
        },
        {
          "id": 13,
          "type": "multiple",
          "description": "Which of the following are prime numbers?",
          "answers": [
            {
              "id": 23,
              "description": "15"
            },
            {
              "id": 24,
              "description": "7"
            },
            {
              "id": 25,
              "description": "12"
            },
            {
              "id": 26,
              "description": "11"
            }
          ]
        }
      ],
      "questions_own": [
        {
          "id": 17,
          "description": "Who wrote Romeo and Juliet?"
        },
        {
          "id": 18,
          "description": "What is the capital of Canada?"
        }
      ],
      "questions_sorting": [
        {
          "id": 9,
          "description": "Arrange the following historical events in chronological order:",
          "answers_sorting": [
            {
              "id": 17,
              "description": "Discovery of America by Christopher Columbus"
            },
            {
              "id": 18,
              "description": "Signing of the Declaration of Independence"
            },
            {
              "id": 19,
              "description": "French Revolution"
            },
            {
              "id": 20,
              "description": "Invention of the printing press by Johannes Gutenberg"
            }
          ]
        },
        {
          "id": 10,
          "description": "Put the following steps in the correct order for baking a cake:",
          "answers_sorting": [
            {
              "id": 21,
              "description": "Preheat the oven"
            },
            {
              "id": 22,
              "description": "Mix the ingredients"
            },
            {
              "id": 23,
              "description": "Pour the batter into a greased pan"
            },
            {
              "id": 24,
              "description": "Bake in the oven"
            }
          ]
        }
      ]
    }
  }
}
```

### Check answers:

```graphql
query{
  sendAnswers(sendAnswersInput: {
    quiz_id: 14
    answers: [
      
      {
        question_id: 12
        question_type: "single"
        single_answer: "Paris"
      },
      
      {
        question_id: 10
        question_type: "sorting"
        sorting_answers: [22,23,21,24]
      }

    ]
  }){
    max_result
    your_result
  }
}
```

Answer
```graphql
{
  "data": {
    "sendAnswers": {
      "max_result": 6,
      "your_result": 2
    }
  }
}
```

### Additional information
* Student points count solely for a fully correct answer. If an mistake was made in the answer or not all correct answer choices were selected, the point will not be counted.
* In the form for submitting an answer to a sorted question, you must enter the answer ids in the correct order.
* The GraphQL schema can be found in the project directory or in the GraphQL playground in the "schema" tab
* Database model:
  ![Quiz app db prototype](https://github.com/Remmist/Nest.js-back-end-development-quiz/assets/97119089/872e7fe7-e08b-49a4-8763-f483861d27f8)
