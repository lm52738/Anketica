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
import React, { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useHistory } from "react-router";
import { PrimaryButton, SecondaryButton } from "../shared/Buttons";

interface Props {
  switchFormMode: VoidFunction;
}

interface LoginFormFields {
  email: string;
  password: string;
}

export const LoginForm: FC<Props> = ({ switchFormMode }) => {
  const { push } = useHistory();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormFields>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login: SubmitHandler<Fields> = async () => {
    // TODO: implement
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 2000);
    });
    push("new-survey");
  };

  return (
    <>
      <Flex minW="full" justify="space-between">
        <Text fontSize="3xl" fontWeight="bold">
          Log in
        </Text>
      </Flex>
      <VStack
        as="form"
        spacing="6"
        align="start"
        minW="full"
        onSubmit={handleSubmit(login)}
      >
        <Box minW="full">
          <FormLabel>E-mail</FormLabel>
          <Input {...register("email")} type="email" />
        </Box>
        <Box minW="full">
          <FormLabel>Password</FormLabel>
          <Input {...register("password")} type="password" />
        </Box>
        <PrimaryButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Logging in"
        >
          Log in
        </PrimaryButton>
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

type GenderType = "male" | "female" | "other";
interface SignUpFormFields {
  firstName: string;
  lastName: string;
  email: string;
  birthDay: string;
  password: string;
  verifyPassword: string;
}

export const SignUpForm: FC<Props> = ({ switchFormMode }) => {
  const { push } = useHistory();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDay: "",
      password: "",
      verifyPassword: "",
    },
  });
  const [gender, setGender] = useState<GenderType>("other");

  const signUp: SubmitHandler<SignUpFormFields> = async (data) => {
    // TODO: implement
    const allData = {
      ...data,
      gender,
    };


    console.log(allData);

    fetch('http://localhost:9000/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(allData),
    })
    .catch(err => {
        console.log(err);
    });

    // validation

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 2000);
    });
    push("new-survey");
  };

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
      <VStack
        as="form"
        minW="full"
        align="start"
        spacing="3"
        onSubmit={handleSubmit(signUp)}
      >
        <HStack spacing="3">
          <Box>
            <FormLabel>First name</FormLabel>
            <Input
              {...register("firstName")}
              required
              disabled={isSubmitting}
              type="text"
            />
          </Box>
          <Box>
            <FormLabel>Last name</FormLabel>
            <Input
              {...register("lastName")}
              required
              disabled={isSubmitting}
              type="text"
            />
          </Box>
        </HStack>
        <Box minW="full">
          <FormLabel>E-mail</FormLabel>
          <Input {...register("email")} type="email" required />
        </Box>
        <Box minW="full">
          <FormLabel>Birthday</FormLabel>
          <Input
            {...register("birthDay", { valueAsDate: true })}
            required
            disabled={isSubmitting}
            type="date"
          />
        </Box>
        <Box minW="full">
          <FormLabel>Gender</FormLabel>
          <RadioGroup
            name="gender"
            defaultValue={gender}
            onChange={(newGender: GenderType) => {
              setGender(newGender);
            }}
          >
            <Flex justify="space-between" w="full">
              <Radio value="male"> Male </Radio>
              <Radio value="female"> Female </Radio>
              <Radio value="other">Other</Radio>
            </Flex>
          </RadioGroup>
        </Box>

        <Box minW="full">
          <FormLabel>Password</FormLabel>
          <Input
            {...register("password")}
            required
            disabled={isSubmitting}
            type="password"
          />
        </Box>
        <Box minW="full">
          <FormLabel>Verify password</FormLabel>
          <Input
            {...register("verifyPassword")}
            required
            disabled={isSubmitting}
            type="password"
          />
        </Box>

        <PrimaryButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Signing up"
        >
          Sign up
        </PrimaryButton>
      </VStack>
    </>
  );
};
