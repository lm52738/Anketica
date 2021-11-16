import {
  Box,
  Flex,
  Icon,
  IconButton,
  Input,
  Tab,
  TabList,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { Question, QuestionMode, useSurvey } from "context/Survey";
import React, { FC, useState } from "react";
import {
  MdAdd,
  MdCheckBox,
  MdRadioButtonChecked,
  MdSubject,
} from "react-icons/md";
import { Answers } from "./EditableQuestionBody";

// regretanje da nisam enum koristio za QuestionMode
const modeMapping: { [k: number]: QuestionMode } = {
  0: "radio",
  1: "checkbox",
  2: "text",
};

const modeMappingReverse: { [k: string]: number } = {
  radio: 0,
  checkbox: 1,
  text: 2,
};

interface Props extends Question {
  index: number;
}

export const EditableQuestion: FC<Props> = ({ index, ...questionProps }) => {
  const { addQuestion, editQuestion } = useSurvey();
  const [question, setQuestion] = useState(questionProps);

  const changeTabMode = (tabIndex: number) => {
    const editedQuestion = {
      ...question,
      mode: modeMapping[tabIndex],
    };

    setQuestion(editedQuestion);

    editQuestion(index, editedQuestion);
  };

  return (
    <Flex alignItems="flex-end">
      <Box bg="white" p="6" minW="300px" boxShadow="lg" borderRadius="md">
        <VStack spacing="6">
          <Input
            placeholder="Question"
            type="text"
            variant="unstyled"
            defaultValue={question.question}
            onChange={(e) => {
              setQuestion({
                ...question,
                question: e.target.value,
              });
            }}
            onBlur={() => {
              editQuestion(index, question);
            }}
          />
          <Tabs
            isFitted
            w="full"
            onChange={changeTabMode}
            defaultIndex={modeMappingReverse[question.mode]}
          >
            <TabList>
              <Tab
                _selected={{
                  borderColor: "primary-60",
                }}
              >
                <Icon
                  boxSize="6"
                  as={MdRadioButtonChecked}
                  color="primary-60"
                />
              </Tab>
              <Tab
                _selected={{
                  borderColor: "primary-60",
                }}
              >
                <Icon boxSize="6" as={MdCheckBox} color="primary-60" />
              </Tab>
              <Tab
                _selected={{
                  borderColor: "primary-60",
                }}
              >
                <Icon boxSize="6" as={MdSubject} color="primary-60" />
              </Tab>
            </TabList>
          </Tabs>
        </VStack>
        <Flex direction="column" py="6">
          <Answers
            answers={question.answers}
            mode={question.mode}
            updateAnswer={(answerIndex: number, newValue: string) => {
              const copy = [...question.answers];
              copy[answerIndex] = newValue;

              const editedQuestion = {
                ...question,
                answers: copy,
              };
              setQuestion(editedQuestion);

              editQuestion(index, editedQuestion);
            }}
          />
          {question.mode !== "text" && (
            <IconButton
              mt="6"
              aria-label="add another answer"
              icon={<MdAdd />}
              onClick={() => {
                if (question.answers[question.answers.length - 1] !== "") {
                  setQuestion({
                    ...question,
                    answers: question.answers.concat(""),
                  });
                }
              }}
            />
          )}
        </Flex>
      </Box>

      <IconButton
        isRound
        ml="3"
        aria-label="add another form section"
        icon={<MdAdd size="25" />}
        bg="primary-60"
        color="white"
        onClick={() => {
          editQuestion(index, question);
          addQuestion();
        }}
      />
    </Flex>
  );
};
