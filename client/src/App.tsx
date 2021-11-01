import React, { useState, FC } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  RadioGroup,
  Radio,
  VStack,
  HStack,
  Flex,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box>
      <Text>Logo</Text>
      <Text>Stvaranje periodickih anketa za pracenje dugorocnog napretka</Text>
      <Box>Tu je logo zamijeni ovo</Box>
    </Box>
  );
};

const LoginForm = () => {
  return (
    <VStack as="form">
      <Box>
        <FormLabel>E-mail</FormLabel>
        <Input type="email" />
      </Box>
      <Box>
        <FormLabel>Password</FormLabel>
        <Input type="password" />
      </Box>
      <Button type="submit">Log in</Button>
    </VStack>
  );
};

const SignUpForm = () => {
  return (
    <VStack as="form">
      <Flex>
        <Box>
          <FormLabel>First name</FormLabel>
          <Input type="text" />
        </Box>
        <Box>
          <FormLabel>Last name</FormLabel>
          <Input type="text" />
        </Box>
      </Flex>
      <Box>
        <FormLabel>E-mail</FormLabel>
        <Input type="email" />
      </Box>
      <Box>
        <FormLabel>Birthday</FormLabel>
        <Input type="date" />
      </Box>

      <Box>
        <FormLabel>Gender</FormLabel>
        <RadioGroup>
          <HStack>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </HStack>
        </RadioGroup>
      </Box>

      <Box>
        <FormLabel>Password</FormLabel>
        <Input type="password" />
      </Box>
      <Box>
        <FormLabel>Verify password</FormLabel>
        <Input type="password" />
      </Box>

      <Button type="submit">Sign up</Button>
    </VStack>
  );
};

const AuthFormSwitch: FC<{
  showLogin: boolean;
  switchFormMode: VoidFunction;
}> = ({ showLogin, switchFormMode }) => {
  return (
    <Box>
      {showLogin && <Text>Don't have an account?</Text>}
      <Button onClick={switchFormMode}>
        {showLogin ? "Sign up" : "Go back"}
      </Button>
    </Box>
  );
};

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  const switchFormMode = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Box>
      <Text>{showLogin ? "Log in" : "Sign up"}</Text>
      {showLogin ? <LoginForm /> : <SignUpForm />}
      <AuthFormSwitch showLogin={showLogin} switchFormMode={switchFormMode} />
    </Box>
  );
};

export const App = () => {
  return (
    <ChakraProvider resetCSS>
      <Hero />
      <Auth />
    </ChakraProvider>
  );
};
