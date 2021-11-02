import { VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { LoginForm, SignUpForm } from "./Forms";

export const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  const switchFormMode = () => {
    setShowLogin(!showLogin);
  };

  return (
    <VStack
      align="start"
      minW="300px"
      w="full"
      maxW="400px"
      minH="400px"
      h="full"
      maxH="650px"
      p="6"
      bg="white"
      boxShadow="lg"
      borderRadius="lg"
      mx="auto"
    >
      {showLogin ? (
        <LoginForm switchFormMode={switchFormMode} />
      ) : (
        <SignUpForm switchFormMode={switchFormMode} />
      )}
    </VStack>
  );
};
