import React, { FC } from "react";
import { ProfileImage } from "components/profileCreation/ProfileImage";
import { AuthProfile } from "components/profileCreation/AuthProfile";
import {Flex, Grid} from "@chakra-ui/react";
import PersistentDrawerLeft from "components/Drawer2";

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
      <Flex 
      direction="column"justify="start" align="">
        <PersistentDrawerLeft/>
      </Flex>
      
        <ProfileImage />
        <AuthProfile />
    </Flex>
    );
  };
  
  export default ProfilePage;