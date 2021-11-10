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
import { Question, QuestionMode, useSurvey } from "pages/NewSurvey";
import React, { FC } from "react";
import {
  MdAdd,
  MdCheckBox,
  MdRadioButtonChecked,
  MdSubject,
} from "react-icons/md";
import { Answers } from "./EditableQuestionBody";

interface Props extends Question {
  editQuestion: (newQuestion: Question) => void;
}

export const EditableQuestion: FC<Props> = ({ editQuestion, ...question }) => {
  const { addQuestion } = useSurvey();

  const changeTabMode = (tabIndex: number) => {
    const mapping: { [k: number]: QuestionMode } = {
      0: "radio",
      1: "checkbox",
      2: "text",
    };

    editQuestion({ ...question, mode: mapping[tabIndex] });
  };

  return (
    <Flex alignItems="flex-end">
      <Box bg="white" p="6" minW="300px" boxShadow="lg" borderRadius="md">
        <VStack spacing="6">
          <Input
            placeholder="Question"
            type="text"
            variant="unstyled"
            onChange={(e) => {
              editQuestion({ ...question, question: e.target.value });
            }}
            onBlur={() => editQuestion(question)}
          />
          <Tabs isFitted w="full" onChange={changeTabMode}>
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
        <Flex direction="column">
          <Answers
            answers={question.answers}
            mode={question.mode}
            updateAnswer={(answerIndex: number, newValue: string) => {
              const copy = [...question.answers];
              copy[answerIndex] = newValue;
              editQuestion({
                ...question,
                answers: copy,
              });
            }}
          />
          {question.mode !== "text" && (
            <IconButton
              aria-label="add another option"
              icon={<MdAdd />}
              onClick={() => {
                editQuestion({
                  ...question,
                  answers: [...question.answers, ""],
                });
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
        onClick={addQuestion}
      />
    </Flex>
  );
};
