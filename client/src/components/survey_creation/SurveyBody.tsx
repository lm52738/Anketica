import { Flex, VStack } from "@chakra-ui/react";
import { emptyQuestion, useSurvey } from "context/Survey";
import { nanoid } from "nanoid";
import React from "react";
import { EditableQuestion } from "./EditableQuestion";
import { LockedInQuestion } from "./LockedInQuestion";

export const SurveyBody = () => {
  const { questions, selectedQuestionIndex } = useSurvey();

  return (
    <Flex direction="column" p="3">
      <VStack maxW="300px" mx="auto" align="start" spacing="6">
        {questions.length > 0 ? (
          questions.map((question, i) => {
            return i === selectedQuestionIndex ? (
              <EditableQuestion key={nanoid()} {...question} index={i} />
            ) : (
              <LockedInQuestion {...question} index={i} />
            );
          })
        ) : (
          <EditableQuestion {...emptyQuestion} index={0} />
        )}
      </VStack>
    </Flex>
  );
};
