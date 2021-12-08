import React, { FC } from "react";
import { ProfileImage } from "components/profileCreation/ProfileImage";
import { ProfileBody } from "components/profileCreation/ProfileBody";
import {Flex} from "@chakra-ui/react";

const ProfilePage: FC = () => {

    return (
        <Flex
      h="full"
      direction="row"
      justify="space-between"
      align="center"
      p={{
        base: 0,
        md: "6",
      }}
      maxW="1440px"
      mx="auto"
    >
        <ProfileImage />
        <ProfileBody />
    </Flex>
    );
  };
  
  export default ProfilePage;