import { VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { ProfileView, ProfileForm } from "./ProfileBody";

export const AuthProfile = () => {
  const [viewProfile, setViewProfile] = useState(true);

  const switchFormMode = () => {
    setViewProfile(!viewProfile);
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
      {viewProfile ? (
        <ProfileView switchFormMode={switchFormMode} />
      ) : (
        <ProfileForm switchFormMode={switchFormMode} />
      )}
    </VStack>
  );
};
