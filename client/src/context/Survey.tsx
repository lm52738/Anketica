import React, { createContext, FC, useContext, useState } from "react";

export interface Question {
  question: string;
  mode: QuestionMode;
  answers: string[];
  isRequired: boolean;
}

export type QuestionMode = "text" | "radio" | "checkbox";

export interface SurveyContext {
  questions: Questions;
  selectedQuestionIndex: number;
  addQuestion: VoidFunction;
  removeQuestion: (questionIndex: number) => void;
  setSelectedQuestion: (questionIndex: number) => void;
  editQuestion: (questionIndex: number, editedQuestion: Question) => void;
  removeEmptyQuestions: () => void;
}

export type Questions = Question[];

export const emptyQuestion: Question = {
  answers: [""],
  isRequired: false,
  mode: "radio",
  question: "",
};

const initialState: SurveyContext = {
  questions: [emptyQuestion],
  selectedQuestionIndex: 0,
  addQuestion: () => {},
  removeQuestion: () => {},
  setSelectedQuestion: () => {},
  editQuestion: () => {},
  removeEmptyQuestions: () => {},
};

const surveyContext = createContext<SurveyContext>(initialState);

export const SurveyProvider: FC = ({ children }) => {
  const [questions, setQuestions] = useState<Questions>([emptyQuestion]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion]);
    setSelectedQuestionIndex(questions.length);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(questions.filter((_, i) => i !== questionIndex));
  };

  const setSelectedQuestion = (questionIndex: number) => {
    setSelectedQuestionIndex(questionIndex);
  };

  const removeEmptyQuestions = () => {
    setQuestions(questions.filter(question => question.answers.length !== 0 && question.question !== ''));
  }

  const editQuestion = (questionIndex: number, editedQuestion: Question) => {
    if (
      editedQuestion.answers[editedQuestion.answers.length - 1] === "" &&
      editedQuestion.answers.length > 1
    ) {
      editedQuestion.answers.pop();
    }
    setQuestions((prev) => {
      prev.splice(questionIndex, 1, editedQuestion);

      return prev;
    });
  };

  return (
    <surveyContext.Provider
      value={{
        questions,
        selectedQuestionIndex,
        addQuestion,
        removeQuestion,
        setSelectedQuestion,
        editQuestion,
        removeEmptyQuestions,
      }}
    >
      {children}
    </surveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(surveyContext);

  if (!context) {
    throw new Error("component has to be child of SurveyProvider");
  }

  return context;
};
