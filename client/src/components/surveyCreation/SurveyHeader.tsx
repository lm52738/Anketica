import { Box, Flex } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/react";
import React from "react";
import { MdSend } from "react-icons/md";
import { PrimaryButton } from "../shared/Buttons";

const unfocusedFormTitleStyles = {
  color: "black",
  fontWeight: "bold",
  fontSize: "lg",
};

const focusedFormTitleStyles = {
  borderBottom: "1px",
  borderBottomColor: "primary-60",
  borderBottomLeftRadius: "none",
  borderBottomRightRadius: "none",
  _placeholder: {
    color: "gray.400",
    fontsize: "md",
    fontWeight: "normal",
  },
};

const unfocusedFormDescriptionStyles = {
  color: "gray.400",
  fontSize: "md",
};

const focusedFormDescriptionStyles = {
  borderBottom: "1px",
  borderBottomColor: "primary-60",
  borderBottomLeftRadius: "none",
  borderBottomRightRadius: "none",
};

export const SurveyHeader = () => {
  const sendSurvey = () => {
    // TODO: implement - popup u kojem se moze setati vrijeme trajanja ankete, koliko cesto se ponavlja i koga sve se poziva
  };

  return (
    <Flex
      as="header"
      p="3"
      bg="white"
      borderBottom="2px"
      borderBottomColor="primary-60"
      align="center"
    >
      <Flex bg="white" direction="column">
        <Input
          {...unfocusedFormTitleStyles}
          placeholder="Form title"
          variant="unstyled"
          _focus={focusedFormTitleStyles}
          _placeholder={unfocusedFormTitleStyles}
        />
        <Box h="1" />
        <Input
          placeholder="Form description"
          variant="unstyled"
          _placeholder={unfocusedFormDescriptionStyles}
          _focus={focusedFormDescriptionStyles}
        />
      </Flex>
      <Box ml="auto">
        <PrimaryButton leftIcon={<MdSend />} onClick={sendSurvey}>
          Send
        </PrimaryButton>
      </Box>
    </Flex>
  );
};
