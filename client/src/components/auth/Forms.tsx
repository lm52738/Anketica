import {
  Box,
  Flex,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { MdClose } from "react-icons/md";
import { PrimaryButton, SecondaryButton } from "../shared/Buttons";

interface Props {
  switchFormMode: VoidFunction;
}

export const LoginForm: FC<Props> = ({ switchFormMode }) => {
  return (
    <>
      <Flex minW="full" justify="space-between">
        <Text fontSize="3xl" fontWeight="bold">
          Log in
        </Text>
      </Flex>
      <VStack as="form" spacing="6" align="start" minW="full">
        <Box minW="full">
          <FormLabel>E-mail</FormLabel>
          <Input type="email" />
        </Box>
        <Box minW="full">
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </Box>
        <PrimaryButton type="submit">Log in</PrimaryButton>
      </VStack>
      <Box minW="full">
        <Text textAlign="center" mb="3">
          Don't have an account?
        </Text>
        <SecondaryButton onClick={switchFormMode}>Sign up</SecondaryButton>
      </Box>
    </>
  );
};

export const SignUpForm: FC<Props> = ({ switchFormMode }) => {
  return (
    <>
      <Flex justify="space-between" minW="full">
        <Text fontSize="3xl" fontWeight="bold">
          Sign up
        </Text>
        <IconButton
          onClick={switchFormMode}
          aria-label="close sign up form"
          icon={<MdClose size="24px" />}
          variant="ghost"
        />
      </Flex>
      <VStack as="form" minW="full" align="start" spacing="3">
        <HStack spacing="3">
          <Box>
            <FormLabel>First name</FormLabel>
            <Input type="text" />
          </Box>
          <Box>
            <FormLabel>Last name</FormLabel>
            <Input type="text" />
          </Box>
        </HStack>
        <Box minW="full">
          <FormLabel>E-mail</FormLabel>
          <Input type="email" />
        </Box>
        <Box minW="full">
          <FormLabel>Birthday</FormLabel>
          <Input type="date" />
        </Box>

        <Box minW="full">
          <FormLabel>Gender</FormLabel>
          <RadioGroup>
            <Flex justify="space-between" minW="full">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Flex>
          </RadioGroup>
        </Box>

        <Box minW="full">
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </Box>
        <Box minW="full">
          <FormLabel>Verify password</FormLabel>
          <Input type="password" />
        </Box>

        <PrimaryButton type="submit">Sign up</PrimaryButton>
      </VStack>
    </>
  );
};
