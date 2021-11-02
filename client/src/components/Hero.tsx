import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import React from "react";
import { HeroImage } from "./HeroImage";

export const Hero = () => {
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
      <Box p="6" w="full">
        <Heading fontSize="7xl">Anketica</Heading>
        <Text>
          Stvaranje periodickih anketa za pracenje dugorocnog napretka
        </Text>
      </Box>
      <HeroImage />
    </Flex>
  );
};
