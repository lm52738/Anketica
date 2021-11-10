import { Checkbox, Flex, Input, Radio, VStack } from "@chakra-ui/react";
import { Question } from "pages/NewSurvey";
import React, { FC } from "react";

type AnswerProps = Partial<Pick<Question, "mode" | "answers">> & {
  updateAnswer: (answerIndex: number, newValue: string) => void;
};

export const Answers: FC<AnswerProps> = ({ mode, answers, updateAnswer }) => {
  return (
    <>
      {mode === "text" ? (
        <Input
          mt="5"
          ml="5"
          disabled
          type="text"
          placeholder="Long answer"
          variant="unstyled"
        />
      ) : (
        <RadioOrCheckbox
          mode={mode}
          answers={answers}
          updateAnswer={updateAnswer}
        />
      )}
    </>
  );
};

export const RadioOrCheckbox: FC<AnswerProps> = ({
  updateAnswer,
  answers,
  mode,
}) => {
  return (
    <>
      <VStack spacing="6" py="6">
        {answers?.map((_, i) => (
          <Flex
            key={i}
            w="full"
            align="center"
            px="3"
            pb="1"
            borderBottom="1px"
            borderBottomColor="gray.300"
          >
            {mode === "radio" ? <Radio isDisabled /> : <Checkbox isDisabled />}
            <Input
              ml="3"
              type="text"
              placeholder="Enter answer"
              variant="unstyled"
              onChange={(e) => updateAnswer(i, e.target.value)}
            />
          </Flex>
        ))}
      </VStack>
    </>
  );
};
