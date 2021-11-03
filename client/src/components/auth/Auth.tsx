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
      minW={{
        base: "100vw",
        md: "300px",
      }}
      w="full"
      maxW={{
        base: "100vw",
        md: "400px",
      }}
      minH={{
        base: "100vh",
        md: "400px",
      }}
      h="full"
      maxH={{
        base: "100vh",
        md: "650px",
      }}
      bg="white"
      boxShadow={{
        base: "none",
        md: "lg",
      }}
      borderRadius={{
        base: "none",
        md: "lg",
      }}
      mx="auto"
      p="6"
      spacing="6"
    >
      {showLogin ? (
        <LoginForm switchFormMode={switchFormMode} />
      ) : (
        <SignUpForm switchFormMode={switchFormMode} />
      )}
    </VStack>
  );
};
