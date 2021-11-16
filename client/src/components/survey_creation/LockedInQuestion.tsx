import { Flex, Heading } from "@chakra-ui/react";
import { Question, useSurvey } from "context/Survey";
import React, { FC } from "react";
import { Answers } from "./EditableQuestionBody";

interface Props extends Question {
  index: number;
}

export const LockedInQuestion: FC<Props> = ({ index, ...questionProps }) => {
  const { setSelectedQuestion } = useSurvey();

  return (
    <Flex
      direction="column"
      p="6"
      minH="150px"
      bg="white"
      borderRadius="md"
      minW="300px"
      boxShadow="md"
      onClick={() => setSelectedQuestion(index)}
    >
      <Heading fontSize="md" mb="6">
        {questionProps.question}
      </Heading>
      <Answers {...questionProps} />
    </Flex>
  );
};
