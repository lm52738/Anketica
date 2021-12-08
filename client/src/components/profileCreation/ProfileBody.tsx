import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

interface User {
  id: number,
  ime: String,
  prezime: String,
  mail: String,
  datum_rod: String,
  rod: String,
}

export const ProfileBody = () => {
  var [user, setUser] = useState<User>();

  const getUserData = () => {
    const token = JSON.parse(localStorage.getItem("user")!).token;
    const headers = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios.get<User>("http://localhost:9000/profile", headers).then((response) => {
        console.log(response.data);
      setUser(response.data);
    });
  };

  useEffect(() => getUserData(), []);

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
      mt="20"
    >
      <Flex direction="column" p="3">
        <VStack maxW="300px" mx="auto" align="start" spacing="6">
          <>
            <Flex minW="full" justify="space-between">
              <Text fontSize="3xl" fontWeight="bold">
                Your profile
              </Text>
            </Flex>
            <VStack as="form" spacing="6" align="start" minW="full">
              <Box minW="full">
                <Text>First name:</Text>
                <Text>{user?.ime}</Text>
              </Box>
              <Box minW="full">
                <Text>Last name:</Text>
                <Text>{user?.prezime}</Text>
              </Box>
              <Box minW="full">
                <Text>Email:</Text>
                <Text>{user?.mail}</Text>
              </Box>
              <Box minW="full">
                <Text>Date of Birth:</Text>
                <Text>{user?.datum_rod}</Text>
              </Box>
              <Box minW="full">
                <Text>Gender:</Text>
                <Text>{user?.rod}</Text>
              </Box>
            </VStack>
          </>
        </VStack>
      </Flex>
    </VStack>
  );
};
