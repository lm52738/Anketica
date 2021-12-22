import { Flex } from "@chakra-ui/layout";
import { SurveyFormBody } from "components/survey_form/SurveyFormBody";
import { SurveyFormHeader } from "components/survey_form/SurveyFormHeader";
import { SurveyProvider } from "context/Survey";
import React, { FC } from "react";

const SurveyPage: FC = () => {
  return (
    <SurveyProvider>
      <Flex as="form" direction="column">
        <SurveyFormHeader />
        <SurveyFormBody />
      </Flex>
    </SurveyProvider>
  );
};

export default SurveyPage;
