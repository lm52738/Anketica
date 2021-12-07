import { Box, Flex, Grid } from "@chakra-ui/layout";
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
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
  const { isOpen: isGroupOpen, onToggle } = useDisclosure();
  const { questions, removeEmptyQuestions } = useSurvey();

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

    console.log(allData);

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
            placeholder="Title"
            variant="unstyled"
            _focus={focusedFormTitleStyles}
            _placeholder={unfocusedFormTitleStyles}
          />
          <Box h="1" />
          <Input
            {...register("description")}
            placeholder="Description"
            variant="unstyled"
            _placeholder={unfocusedFormDescriptionStyles}
            _focus={focusedFormDescriptionStyles}
          />
        </Flex>
        <Box ml="auto">
          <PrimaryButton
            leftIcon={<MdSend />}
            onClick={() => {
              removeEmptyQuestions();
              onOpen();
            }}
          >
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
        <ModalContent minW="350px">
          <ModalHeader>Send Survey</ModalHeader>
          <ModalBody>
            <Grid columnGap="10" rowGap="5" templateColumns="repeat(2, 1fr)">
              {isGroupOpen ? (
                <FormControl>
                  <FormLabel>Select existing group</FormLabel>
                  <Select>
                    <option>Grupa 1</option>
                    <option>Grupa 2</option>
                  </Select>
                </FormControl>
              ) : (
                <>
                  <FormControl>
                    <FormLabel>Group name</FormLabel>
                    <Input />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Emails</FormLabel>
                    <Input />
                  </FormControl>
                </>
              )}

              <Button mt="auto" onClick={onToggle}>
                {isGroupOpen ? "New group" : "Existing group"}
              </Button>
            </Grid>

            <FormControl>
              <FormLabel>Email title</FormLabel>
              <Input defaultValue="Invitation to survey" />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Input defaultValue="Take my survey!" />
            </FormControl>
            <FormControl>
              <FormLabel>How often</FormLabel>
              <Select>
                <option>Grupa 1</option>
                <option>Grupa 2</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Duration</FormLabel>
              <Select>
                <option>1 week</option>
                <option>2 weeks</option>
                <option>4 weeks</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Recurrances</FormLabel>
              <NumberInput defaultValue={0}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
