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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import { useHistory } from "react-router-dom";
import ReactSelect from "react-select";
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
  howOften: string;
  duration: string;
  recurrances: number;
  groupName: string;
  emails: string;
  emailTitle: string;
  emailMessage: string;
  existingGroupName: string;
}

interface group {
  id: number;
  ime: string;
  mail: string;
}

export const SurveyHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isGroupOpen, onToggle } = useDisclosure();
  const { questions, removeEmptyQuestions } = useSurvey();
  const { push } = useHistory();

  let [mails, setMails] = useState<string[]>([]);
  let groups = Array<group>();
  var [rows, setRows] = useState<group[]>([]);
  let [selectedMails, setSelectedMails] = useState([]);

  //dohvat grupa
  const getUserData = () => {
    axios.get<group[]>("http://localhost:9000/groups").then((response) => {
      setMails(
        response.data
          .map((grupa) => grupa.mail)
          // unique
          .filter((value, index, self) => self.indexOf(value) === index)
      );

      for (let grupa of response.data) {
        if (grupa) {
          let id = grupa.id;
          let oldGroup = groups.find((g) => g.id === id);

          if (oldGroup) {
            let mail = oldGroup.mail.concat(", " + grupa.mail);
            grupa.mail = mail;

            groups.pop();
          }
          groups.push(grupa);
        }
      }

      if (groups.length > 0) {
        setRows(groups);
      }
    });
  };

  // treba dohvatit
  useEffect(() => getUserData(), []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InputFields>({
    defaultValues: {
      title: "",
      description: "",
      howOften: "",
      duration: "",
      recurrances: 0,
      existingGroupName: "",
      groupName: "",
      emailTitle: "Invitation to survey",
      emailMessage: "Take my survey!",
    },
  });

  const sendSurvey = handleSubmit(async (data) => {
    const groupName = isGroupOpen ? data.existingGroupName : data.groupName;
    if (!isGroupOpen) {
      const ime = groupName;
      const mails = selectedMails.map((event) => event.value);

      console.log({ ime, mails });
      await axios.post("http://localhost:9000/addGroup", { ime, mails });
    }

    const description = data.description;
    const duration = data.duration;
    const emailMessage = data.emailMessage;
    const emailTitle = data.emailTitle;
    const howOften = data.howOften;
    const recurrances = data.recurrances;
    const title = data.title;

    const allData = {
      description,
      duration,
      emailMessage,
      emailTitle,
      howOften,
      recurrances,
      title,
      groupName,
      questions,
    };

    console.log(allData);

    await axios.post("http://localhost:9000/anketa", allData);

    push("surveys");
  });

  const handleCheckBox = (event) => {
    setSelectedMails(event);
    console.log(selectedMails);
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
                  <Select {...register("existingGroupName")}>
                    {rows.map((grupa) => (
                      <option>{grupa.ime}</option>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <>
                  <FormControl>
                    <FormLabel>Group name</FormLabel>
                    <Input {...register("groupName")} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Emails</FormLabel>
                    <ReactSelect
                      defaultValue={selectedMails}
                      isMulti
                      name="Emails"
                      options={mails.map((mail) => ({
                        value: mail,
                        label: mail,
                      }))}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleCheckBox}
                    />
                  </FormControl>
                </>
              )}

              <Button mt="auto" onClick={onToggle}>
                {isGroupOpen ? "New group" : "Existing group"}
              </Button>
            </Grid>

            <FormControl>
              <FormLabel>Email title</FormLabel>
              <Input {...register("emailTitle")} />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Input {...register("emailMessage")} />
            </FormControl>
            <FormControl>
              <FormLabel>How often</FormLabel>
              <Select {...register("howOften")}>
                <option value="0">Every day</option>
                <option value="1">Every week</option>
                <option value="2">Every month</option>
                <option value="3">Every year</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Duration of each survey</FormLabel>
              <Select {...register("duration")}>
                <option value="0">1 week</option>
                <option value="1">2 weeks</option>
                <option value="2">3 weeks</option>
                <option value="3">1 month</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Recurrances</FormLabel>
              <NumberInput defaultValue={0}>
                <NumberInputField {...register("recurrances")} />
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
