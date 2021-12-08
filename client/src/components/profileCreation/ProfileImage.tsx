import { Box, Flex } from "@chakra-ui/layout";
import React from "react";
import { Image } from "./Image";

export const ProfileImage = () => {
    return (
      <Flex
      h="full"
      minW="300px"
      w="full"
      maxW="900px"
      display={{
        base: "none",
        lg: "flex",
      }}
      align="center"
      justify="center"
      direction="column"
    >
      <Image/>
    </Flex>
    );
  };
  