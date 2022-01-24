import { Flex } from "@chakra-ui/layout";
import { SurveyBody } from "components/survey_creation/SurveyBody";
import { SurveyHeader } from "components/survey_creation/SurveyHeader";
import { SurveyProvider } from "context/Survey";
import React, { FC } from "react";
import PersistentDrawerLeft from "../components/Drawer2";


const NewSurvey: FC = () => {
  return (
    <SurveyProvider>
      <Flex as="form" direction="column">
        <SurveyHeader />
        <SurveyBody />
      </Flex>
    </SurveyProvider>
  );
};

export default NewSurvey;
