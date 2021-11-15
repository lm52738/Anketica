import { Box, Flex } from "@chakra-ui/layout";
import React from "react";

export const ProfileHeader = () => {
    return (
        <Flex
        as="header"
        p="3"
        bg="white"
        borderBottom="2px"
        borderBottomColor="primary-60"
        align="center"
      >
        <Flex bg="white" direction="column" h="10">
        </Flex>
        <Box ml="auto">
        </Box>
      </Flex>
    );
  };
  