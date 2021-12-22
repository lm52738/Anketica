import { Flex, VStack } from "@chakra-ui/react";
import axios from "axios";
import { EditableQuestion } from "components/survey_creation/EditableQuestion";
import { emptyQuestion, useSurvey } from "context/Survey";
import React, { useEffect } from "react";

export const SurveyFormBody = () => {
  const { questions } = useSurvey();

  useEffect(() => {
    const getSurveyQuestions = async () => {
      const response = await axios.get(`http://localhost:9000/anketa/${5}`);

      console.log(response.data);
    };

    getSurveyQuestions();
  }, []);

  return (
    <Flex direction="column" p="3">
      <VStack maxW="300px" mx="auto" align="start" spacing="6">
        {questions.map((question, i) => {
          return <EditableQuestion {...emptyQuestion} index={0} />;
        })}
      </VStack>
    </Flex>
  );
};
