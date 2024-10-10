"use client";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

type Answer = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  answers: Answer[];
};

type QuizState = {
  currentQuestion: number;
  score: number;
  showResults: boolean;
  questions: Question[];
  isLoading: boolean;
};

export default function QuizComponent() {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    showResults: false,
    questions: [],
    isLoading: true,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&type=multiple"
        );
        const data = await response.json();

        const questions = data.results.map((item: any) => {
          const incorrectAnswers = item.incorrect_answers.map(
            (answer: string) => ({
              text: answer,
              isCorrect: false,
            })
          );
          const correctAnswer = {
            text: item.correct_answer,
            isCorrect: true,
          };
          return {
            question: item.question,
            answers: [...incorrectAnswers, correctAnswer].sort(
              () => Math.random() - 0.5
            ),
          };
        });
        setState((prevState) => ({
          ...prevState,
          questions,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerClick = (isCorrect: boolean): void => {
    if (isCorrect) {
      setState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
    }

    const nextQuestion = state.currentQuestion + 1;
    if (nextQuestion < state.questions.length) {
      setState((prevState) => ({
        ...prevState,
        currentQuestion: nextQuestion,
      }));
    } else {
      setState((prevState) => ({ ...prevState, showResults: true }));
    }
  };

  const resetQuiz = (): void => {
    setState({
      currentQuestion: 0,
      score: 0,
      showResults: false,
      questions: state.questions,
      isLoading: false,
    });
  };

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 mb-10">
        <div className=" w-48 h-48 bg-background text-foreground">
          <Spinner className="text-fuchsia-200" />
          <p className="text-fuchsia-950">
            Loading quiz questions, please wait...
          </p>
        </div>
      </div>
    );
  }

  if (state.questions.length === 0) {
    return <div> No questions available.</div>;
  }

  const currentQuestion = state.questions[state.currentQuestion];
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-background text-foreground
    bg-gradient-to-r from-fuchsia-50 via-white to-fuchsia-50"
    >
      {state.showResults ? (
        <div
          className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md ring-2 ring-fuchsia-200
        ring-offset-2 ring-offset-fuchsia-100"
        >
          <h2 className="text-2xl font-bold mb-4 text-fuchsia-950">Results</h2>
          <p className="text-lg mb-4">
            You scored <b className="text-fuchsia-950">{state.score}</b> out of{" "}
            <b className="text-fuchsia-950">{state.questions.length}</b>
          </p>
          <div className="flex items-center justify-center">
            <Button
              onClick={resetQuiz}
              className="w-80 rounded-3xl bg-fuchsia-950 shadow-md"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="bg-card p-5 rounded-lg shadow-lg w-full max-w-md ring-1 ring-fuchsia-200
        ring-offset-2 ring-offset-fuchsia-100"
        >
          <h2 className="text-2xl font-bold mb-4 text-fuchsia-950">
            Question {state.currentQuestion + 1}/{state.questions.length}
          </h2>
          <p
            className="text-lg mb-4"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
          <div className="grid gap-6 items-center justify-center ml-auto mr-auto w-full">
            {currentQuestion.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer.isCorrect)}
                className="w-80 bg-fuchsia-950 rounded-3xl shadow-md "
              >
                {answer.text}
              </Button>
            ))}
          </div>
          <div className="mt-4 text-right">
            <span className="text-muted-foreground text-fuchsia-800 font-bold text-xl">
              Score: {state.score}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
