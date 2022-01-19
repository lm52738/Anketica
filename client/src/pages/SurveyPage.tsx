import { Flex, Box, Text, VStack, Heading } from "@chakra-ui/layout";
import {
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { PrimaryButton } from "components/shared/Buttons";
import { getUser } from "components/shared/Utils";
import { SurveyProvider } from "context/Survey";
import React, { FC, useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { useHistory, useParams } from "react-router-dom";

const unfocusedFormTitleStyles = {
  color: "black",
  fontWeight: "bold",
  fontSize: "lg",
};

const unfocusedFormDescriptionStyles = {
  color: "gray.400",
  fontSize: "md",
};

interface SurveyQuestion {
  questionId: string;
  question: string;
  type: number;
  required: boolean;
  possibleAnswers: string;
}

interface SurveyDetails {
  id: string;
  name: string;
  description: string;
  questions: SurveyQuestion[];
}

interface InputSurvey {
  id: string;
  questions: Map<string, string[]>;
}

interface VlastitaAnketa {
  id: string;
}

const SurveyPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [surveyDetails, setSurvey] = useState<SurveyDetails>({
    id: "",
    name: "",
    description: "TODO",
    questions: [],
  });
  const { push } = useHistory();

  const [inputSurvey, setInputs] = useState<InputSurvey>({
    id: "",
    questions: new Map<string, string[]>(),
  });

  const sendSurvey = async () => {
    console.log({
      ...inputSurvey,
      email: getUser().osoba.mail,
    });
    await axios.post(`http://localhost:9000/anketa/submit-survey`, {
      ...inputSurvey,
      email: getUser().osoba.mail,
    });
    push("/surveys");
  };

  useEffect(() => {
    const getSurveyQuestions = async () => {
      const response2 = await axios.get(
        `http://localhost:9000/anketa/vlastita/${id}`
      );
      console.log(response2.data);
      const response = await axios.get<SurveyDetails>(
        `http://localhost:9000/anketa/id/${id}`
      );
      setSurvey(response.data);
      setInputs({
        id: response.data.id,
        questions: new Map<string, string[]>(),
      });
    };

    getSurveyQuestions();
  }, []);

  return (
    <SurveyProvider>
      <Flex as="form" direction="column">
        <Flex
          as="header"
          p="3"
          bg="white"
          borderBottom="2px"
          borderBottomColor="primary-60"
          align="center"
        >
          <Flex bg="white" direction="column">
            <Text {...unfocusedFormTitleStyles}>{surveyDetails.name}</Text>
            <Box h="1" />
            <Text {...unfocusedFormDescriptionStyles}>
              {surveyDetails.description}
            </Text>
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

        <Flex direction="column" p="3">
          <VStack maxW="300px" mx="auto" align="start" spacing="6">
            {surveyDetails.questions.map((question, i) => {
              return (
                <Flex
                  direction="column"
                  p="6"
                  minH="150px"
                  bg="white"
                  borderRadius="md"
                  minW="300px"
                  boxShadow="md"
                >
                  <Heading fontSize="md" mb="6">
                    {question.question}
                  </Heading>

                  {(question.type === 0 && (
                    <RadioGroup
                      onChange={(e) => {
                        const questions = inputSurvey.questions;
                        questions.set(question.questionId, [e]);
                        setInputs({ id: id, questions: questions });
                      }}
                    >
                      <Flex direction="column">
                        {question.possibleAnswers
                          .split(",")
                          .map((possibleAnswer) => {
                            return (
                              <Radio value={possibleAnswer}>
                                {possibleAnswer}
                              </Radio>
                            );
                          })}
                      </Flex>
                    </RadioGroup>
                  )) ||
                    (question.type === 1 && (
                      <Input
                        onChange={(e) => {
                          const questions = inputSurvey.questions;
                          questions.set(question.questionId, [e.target.value]);
                          setInputs({ id: id, questions: questions });
                        }}
                      />
                    )) ||
                    (question.type === 2 && (
                      <CheckboxGroup
                        onChange={(e: string[]) => {
                          const questions = inputSurvey.questions;
                          questions.set(question.questionId, e);
                          setInputs({ id: id, questions: questions });
                        }}
                      >
                        <Flex direction="column">
                          {question.possibleAnswers
                            .split(",")
                            .map((possibleAnswer) => {
                              return (
                                <Checkbox value={possibleAnswer}>
                                  {possibleAnswer}
                                </Checkbox>
                              );
                            })}
                        </Flex>
                      </CheckboxGroup>
                    )) || <Text>Shouldn't happen</Text>}
                </Flex>
              );
            })}
          </VStack>
        </Flex>
      </Flex>
    </SurveyProvider>
  );
};

export default SurveyPage;
