import React, { FC } from "react";
import { ProfileImage } from "components/profileCreation/ProfileImage";
import { AuthProfile } from "components/profileCreation/AuthProfile";
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
        <AuthProfile />
    </Flex>
    );
  };
  
  export default ProfilePage;