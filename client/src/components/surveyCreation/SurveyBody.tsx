import { Flex, VStack } from "@chakra-ui/react";
import { emptyQuestion, Question, useSurvey } from "pages/NewSurvey";
import React from "react";
import { EditableQuestion } from "./EditableQuestion";
import { LockedInQuestion } from "./LockedInQuestion";

export const SurveyBody = () => {
  const { questions, selectedQuestionIndex, editQuestion } = useSurvey();

  return (
    <Flex direction="column" p="3">
      <VStack maxW="300px" mx="auto" align="start" spacing="6">
        {questions.length > 0 ? (
          questions.map((question, i) => {
            return i === selectedQuestionIndex ? (
              <EditableQuestion
                key={i}
                {...question}
                editQuestion={() => editQuestion(i, question)}
              />
            ) : (
              <LockedInQuestion {...question} />
            );
          })
        ) : (
          <EditableQuestion
            {...emptyQuestion}
            editQuestion={(question: Question) => editQuestion(0, question)}
          />
        )}
      </VStack>
    </Flex>
  );
};
