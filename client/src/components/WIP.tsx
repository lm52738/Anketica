import {
  Box,
  FormLabel,
  Icon,
  Input,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdCheckBox, MdRadioButtonChecked, MdSubject } from "react-icons/md";

const LockedInCard = () => {
  return (
    <VStack>
      <Box>
        <Text>Pitanje</Text>
      </Box>
      <Box>
        <Text>Odgovor</Text>
      </Box>
    </VStack>
  );
};

// TODO: treba postavit state editable carda

const EditableCard = () => {
  const [state, setState] = useState<{
    title: string;
  }>();

  return (
    <Box>
      <Box>
        {/* head */}
        <Box>
          <FormLabel>Pitanje</FormLabel>
          <Input type="text" />
        </Box>
        <EditableCardType />
      </Box>
      <Box>{/* body */}</Box>
    </Box>
  );
};

const EditableCardType = () => {
  return (
    <Box>
      <Tabs isFitted>
        <TabList>
          <Tab>
            <Icon as={MdSubject} />
          </Tab>
          <Tab>
            <Icon as={MdRadioButtonChecked} />
          </Tab>
          <Tab>
            <Icon as={MdCheckBox} />
          </Tab>
        </TabList>
      </Tabs>
    </Box>
  );
};

interface Choice {
  title: string;
  options: string[];
  type: "text" | "radio" | "checkbox";
}

export const NewSurveyForm = () => {
  const [currentlyEdited, setCurrentlyEdited] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([
    {
      options: [""],
      title: "test title 🤣",
      type: "radio",
    },
  ]);

  return (
    <Box>
      <Box>
        <Text>Form title</Text>
        <Text>Form description</Text>
      </Box>
      <VStack>
        {<EditableCard />}
        {/* hocu prikazat samo lockedInChoiceve */}
        {choices.map((choice) => (
          <LockedInCard />
        ))}
        {/* hocu prikazat trenutni koji se edita */}
      </VStack>
    </Box>
  );
};
