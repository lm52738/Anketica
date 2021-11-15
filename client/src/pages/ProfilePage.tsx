import React, { FC } from "react";
import { ProfileHeader } from "components/profileCreation/ProfileHeader";
import { ProfileBody } from "components/profileCreation/ProfileBody";
import {Flex} from "@chakra-ui/react";

const ProfilePage: FC = () => {

    return (
        <Flex as="form" direction="column">
            <ProfileHeader />
            <ProfileBody />
        </Flex>
    );
  };
  
  export default ProfilePage;