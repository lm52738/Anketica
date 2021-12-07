import { Box, Flex } from "@chakra-ui/layout";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useSurvey } from "context/Survey";
import React from "react";
import { useForm } from "react-hook-form";
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

interface InputFields {
  title: string;
  description: string;
}

export const SurveyHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { questions } = useSurvey();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InputFields>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const sendSurvey = handleSubmit(async ({ title, description }) => {
    // TODO: koliko cesto se ponavlja i koliko traje, ime grupe, mailovi etc.
    const allData = {
      title,
      description,
      questions,
    };

    const token = JSON.parse(localStorage.getItem("user")!).token;
    const headers = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    await axios.post("http://localhost:9000/anketa", allData, headers);
  });

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
          <Input
            {...register("title")}
            {...unfocusedFormTitleStyles}
            placeholder="Form title"
            variant="unstyled"
            _focus={focusedFormTitleStyles}
            _placeholder={unfocusedFormTitleStyles}
          />
          <Box h="1" />
          <Input
            {...register("description")}
            placeholder="Form description"
            variant="unstyled"
            _placeholder={unfocusedFormDescriptionStyles}
            _focus={focusedFormDescriptionStyles}
          />
        </Flex>
        <Box ml="auto">
          <PrimaryButton leftIcon={<MdSend />} onClick={onOpen}>
            Send
          </PrimaryButton>
        </Box>
      </Flex>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Survey</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Group name</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Emails</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Email title</FormLabel>
              <Input />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Input />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button
                variant="ghost"
                onClick={onClose}
                isDisabled={isSubmitting}
              >
                Close
              </Button>
              <Button
                color="primary-60"
                variant="outline"
                onClick={sendSurvey}
                isLoading={isSubmitting}
              >
                Send
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
