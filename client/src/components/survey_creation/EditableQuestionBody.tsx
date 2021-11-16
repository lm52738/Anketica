import { Checkbox, Flex, Input, Radio, VStack } from "@chakra-ui/react";
import { Question } from "context/Survey";
import React, { FC } from "react";
import { nanoid } from "nanoid";

type AnswerProps = Partial<Pick<Question, "mode" | "answers">> & {
  updateAnswer?: (answerIndex: number, newValue: string) => void;
};

export const Answers: FC<AnswerProps> = ({ mode, answers, updateAnswer }) => {
  return (
    <>
      {mode === "text" ? (
        <Input
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
    <VStack spacing="6">
      {answers?.map((answer, i) => (
        <Flex
          key={nanoid()}
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
            defaultValue={answer}
            isDisabled={updateAnswer == null}
            onBlur={(e) => {
              updateAnswer?.(i, e.target.value);
            }}
          />
        </Flex>
      ))}
    </VStack>
  );
};
