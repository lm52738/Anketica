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
import { getUser, useRedirect } from "components/shared/Utils";
import { SurveyProvider } from "context/Survey";
import addDays from "date-fns/addDays";
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
  id: number;
  name: string;
  description: string;
  questions: SurveyQuestion[];
}

interface InputSurvey {
  id: number;
  questions: Map<string, string[]>;
}

interface VlastitaAnketa {
  id: number;
  id_slanje_ankete: number;
  ispunjena: boolean;
  mail: string;
}

interface SlanjeAnketa {
  datum: string;
  id: number;
  id_ankete: number;
  trajanje: number;
}

const SurveyPage: FC = () => {
  useRedirect();

  const { id } = useParams<{ id: string }>();
  const [surveyDetails, setSurvey] = useState<SurveyDetails>({
    id: -1,
    name: "",
    description: "",
    questions: [],
  });
  const { push } = useHistory();

  const [errorMsg, setError] = useState<string | null>();

  const [inputSurvey, setInputs] = useState<InputSurvey>({
    id: -1,
    questions: new Map<string, string[]>(),
  });

  const sendSurvey = async () => {
    const body = {
      id: inputSurvey.id,
      questions: Object.fromEntries(inputSurvey.questions.entries()),
      mail: getUser().osoba.mail,
    };
    console.log(body);

    await axios.post(`http://localhost:9000/anketa/submit-survey`, body);
    push("/surveys");
  };

  useEffect(() => {
    const getSurveyQuestions = async () => {
      localStorage.setItem("survey", `/survey/${id}`);

      const responseVlastita = await axios.get<VlastitaAnketa[]>(
        `http://localhost:9000/anketa/vlastita/${id}`
      );

      if (responseVlastita.data.length === 0) {
        setError("This survey doesn't exist");
      } else {
        const vlastita = responseVlastita.data[0];

        console.log(vlastita);
        const userMail = getUser().osoba.mail;

        if (vlastita.ispunjena) {
          setError("You already filled out this survey!");
        } else {
          if (userMail === vlastita.mail) {
            const responseSlanje = (
              await axios.get<SlanjeAnketa[]>(
                `http://localhost:9000/anketa/slanje/${vlastita.id_slanje_ankete}`
              )
            ).data[0];

            const datum = new Date(responseSlanje.datum);

            const today = new Date();

            const startDate = new Date(datum);
            const deadline = addDays(new Date(datum), responseSlanje.trajanje);

            const active = today >= startDate && today <= deadline;

            if (!active) {
              setError("This survey is inactive!");
            } else {
              const response = await axios.get<SurveyDetails>(
                `http://localhost:9000/anketa/id/${responseSlanje.id_ankete}`
              );

              console.log(response.data);

              setSurvey(response.data);
              setInputs({
                id: vlastita.id_slanje_ankete,
                questions: new Map<string, string[]>(),
              });
            }
          } else {
            setError("You dont have access to this survey!");
          }
        }
      }
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
            <Text {...unfocusedFormTitleStyles}>
              {errorMsg ?? surveyDetails.name}
            </Text>
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
                        setInputs({ id: inputSurvey.id, questions: questions });
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
                          setInputs({
                            id: inputSurvey.id,
                            questions: questions,
                          });
                        }}
                      />
                    )) ||
                    (question.type === 2 && (
                      <CheckboxGroup
                        onChange={(e: string[]) => {
                          const questions = inputSurvey.questions;
                          questions.set(question.questionId, e);
                          setInputs({
                            id: inputSurvey.id,
                            questions: questions,
                          });
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
