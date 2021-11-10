import { Flex } from "@chakra-ui/react";
import { Auth } from "components/auth/Auth";
import { Hero } from "components/Hero";
import React, { FC } from "react";

const Authentification: FC = () => {
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
      <Hero />
      <Auth />
    </Flex>
  );
};

export default Authentification;
