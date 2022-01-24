import React, { FC } from "react";
import { ProfileImage } from "components/profileCreation/ProfileImage";
import { AuthProfile } from "components/profileCreation/AuthProfile";
import {Flex, Grid} from "@chakra-ui/react";
import PersistentDrawerLeft from "components/Drawer2";
import { ProfileHeader } from "components/profileCreation/ProfileHeader";

const ProfilePage: FC = () => {

    return (
      <div>
        <ProfileHeader />
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
      </div>
    
    );
  };
  
  export default ProfilePage;