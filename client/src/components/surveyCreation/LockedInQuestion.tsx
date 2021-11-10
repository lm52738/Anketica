import { Box, Text, VStack } from "@chakra-ui/react";
import { Question } from "pages/NewSurvey";
import React, { FC } from "react";

export const LockedInQuestion: FC<Question> = (question) => {
  return (
    <VStack
      minH="300px"
      bg="white"
      borderRadius="md"
      minW="300px"
      boxShadow="md"
    >
      <Box>
        <Text>{question.question}</Text>
      </Box>
      <Box>
        {question.answers.map((answer, i) => (
          <Box key={i}>{answer}</Box>
        ))}
      </Box>
    </VStack>
  );
};
