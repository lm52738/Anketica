import { Box, Flex, Text } from "@chakra-ui/layout";
import { useSurvey } from "context/Survey";
import React from "react";
import { MdSend } from "react-icons/md";
import { PrimaryButton } from "../shared/Buttons";

const unfocusedFormTitleStyles = {
  color: "black",
  fontWeight: "bold",
  fontSize: "lg",
};

const unfocusedFormDescriptionStyles = {
  color: "gray.400",
  fontSize: "md",
};

export const SurveyFormHeader = () => {
  const { questions } = useSurvey();

  //TODO nece se slati questions nego answers
  const sendSurvey = () => {
    console.log(questions);
    // await axios.post("http://localhost:9000/anketa", allData);
  };

  return (
    <>
      <Flex
        as="header"
        p="3"
        bg="white"
        borderBottom="2px"
        borderBottomColor="primary-60"
        align="center"
      >
        <Flex bg="white" direction="column">
          <Text {...unfocusedFormTitleStyles}>Test</Text>
          <Box h="1" />
          <Text {...unfocusedFormDescriptionStyles}>Description</Text>
        </Flex>
        <Box ml="auto">
          <PrimaryButton
            leftIcon={<MdSend />}
            onClick={() => {
              sendSurvey();
            }}
          >
            Submit
          </PrimaryButton>
        </Box>
      </Flex>
    </>
  );
};
