import { Flex } from "@chakra-ui/layout";
import { SurveyHeader } from "components/surveyCreation/SurveyHeader";
import { SurveyBody } from "components/surveyCreation/SurveyBody";
import React, { createContext, FC, useContext, useState } from "react";

export interface Question {
  question: string;
  mode: QuestionMode;
  answers: string[];
  isRequired: boolean;
}

export type QuestionMode = "text" | "radio" | "checkbox";

export interface SurveyContext {
  questions: Question[];
  selectedQuestionIndex: number;
  addQuestion: VoidFunction;
  removeQuestion: (questionIndex: number) => void;
  setSelectedQuestion: (questionIndex: number) => void;
  editQuestion: (questionIndex: number, editedQuestion: Question) => void;
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
};

const surveyContext = createContext<SurveyContext>(initialState);

const SurveyProvider: FC = ({ children }) => {
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

  const editQuestion = (questionIndex: number, editedQuestion: Question) => {
    const copy = [...questions];
    copy[questionIndex] = editedQuestion;
    console.log(editedQuestion);
    setQuestions(copy);
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

const NewSurvey: FC = () => {
  return (
    <SurveyProvider>
      <Flex as="form" direction="column">
        <SurveyHeader />
        <SurveyBody />
      </Flex>
    </SurveyProvider>
  );
};

export default NewSurvey;
