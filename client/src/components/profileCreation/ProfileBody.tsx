import React from "react";
import axios from "axios";
import {
    Box,
    Flex,
    Text,
    VStack,
  } from "@chakra-ui/react";

const data = async() => {
    const response = await axios.post("http://localhost:9000/login");
    console.log(response.status);
    return response;  
};
  

export const ProfileBody = () => {

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
            mt="20">
            
          <Flex direction="column" p="3">
            <VStack maxW="300px" mx="auto" align="start" spacing="6">
                <>
                <Flex minW="full" justify="space-between">
                    <Text fontSize="3xl" fontWeight="bold">
                    Your profile
                    </Text>
                </Flex>
                <VStack
                    as="form"
                    spacing="6"
                    align="start"
                    minW="full"
                >
                    <Box minW="full">
                    <Text>First name:</Text>
                    <Text>{data.ime}</Text>
                    </Box>
                    <Box minW="full">
                    <Text>Last name:</Text>
                    </Box>
                    <Box minW="full">
                    <Text>Email:</Text>
                    </Box>
                    <Box minW="full">
                    <Text>Date of Birth:</Text>
                    </Box>
                    <Box minW="full">
                    <Text>Gender:</Text>
                    </Box>
                </VStack>
                </>
            </VStack>
            </Flex>
          
      </VStack>
    
  );
};