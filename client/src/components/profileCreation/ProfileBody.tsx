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
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsFillPersonFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { PrimaryButton, SecondaryButton } from "../shared/Buttons";
import { getUser } from "../shared/Utils";

interface Props {
  switchFormMode: VoidFunction;
}

interface User {
  id: number;
  ime: string;
  prezime: string;
  mail: string;
  datum_rod: Date;
  rod: string;
  password: string;
}

export const ProfileView: FC<Props> = ({ switchFormMode }) => {
  var [user, setUser] = useState<User>();
  const thisUser = getUser();

  const getUserData = () => {
    axios.get<User>("http://localhost:9000/profile").then((response) => {
      console.log(response.data);
      setUser(response.data);
    });
  };

  useEffect(() => getUserData(), []);

  return (
    <>
      <Flex minW="full">
        <BsFillPersonFill size={50} />
        <Text fontSize="3xl" fontWeight="bold">
          Your profile
        </Text>
      </Flex>
      <VStack as="form" spacing="6" align="start" minW="full">
        <Box minW="full">
          <Text>First name:</Text>
          {/*<Text>{user?.ime}</Text>*/}
          <Text>{thisUser.osoba.ime}</Text>
        </Box>
        <Box minW="full">
          <Text>Last name:</Text>
          {/*<Text> {user?.prezime}</Text>*/}
          <Text>{thisUser.osoba.prezime}</Text>
        </Box>
        <Box minW="full">
          <Text>Email:</Text>
          {/*<Text>{user?.mail}</Text>*/}
          <Text>{thisUser.osoba.mail}</Text>
        </Box>
        <Box minW="full">
          <Text>Date of Birth:</Text>
          {/*<Text>{user?.datum_rod.toString().substring(0, 10)}</Text>*/}
          <Text>{thisUser.osoba.datum_rod.toString().substring(0, 10)}</Text>
        </Box>
        <Box minW="full">
          <Text>Gender:</Text>
          {/*<Text>{user?.rod}</Text>*/}
          <Text>{thisUser.osoba.rod}</Text>
        </Box>
      </VStack>
      <Box minW="full">
        <SecondaryButton onClick={switchFormMode}>Edit profile</SecondaryButton>
      </Box>
    </>
  );
};

type GenderType = "male" | "female" | "other";
interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  birthDay: Date;
  password: string;
  verifyPassword: string;
}

export const ProfileForm: FC<Props> = ({ switchFormMode }) => {
  var [user, setUser] = useState<User>(getUser().osoba);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.ime,
      lastName: user?.prezime,
      email: user?.mail,
      birthDay: user?.datum_rod,
      password: "",
      verifyPassword: "",
    },
  });

  const getGender = () => {
    if (user?.rod === "f") {
      return "female";
    } else if (user?.rod === "m") {
      return "male";
    } else {
      return "other";
    }
  };

  const [gender, setGender] = useState<GenderType>(getGender());

  const id = user?.id;

  const signUp: SubmitHandler<ProfileForm> = async (data) => {
    const allData = {
      ...data,
      gender,
      id,
    };

    console.log(allData);
    // const response = await axios.post("http://localhost:9000/profile", allData);

    // if (response.data.token) {
    //   localStorage.setItem("user", JSON.stringify(response.data));
    // }

    // // validation
    // push("surveys");
  };

  return (
    <>
      <Flex justify="space-between" minW="full">
        <Text fontSize="3xl" fontWeight="bold">
          Edit Profile
        </Text>
        <IconButton
          onClick={switchFormMode}
          aria-label="close edit form"
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
              defaultValue={user?.ime}
            />
          </Box>
          <Box>
            <FormLabel>Last name</FormLabel>
            <Input
              {...register("lastName")}
              required
              disabled={isSubmitting}
              type="text"
              defaultValue={user?.prezime}
            />
          </Box>
        </HStack>
        <Box minW="full">
          <FormLabel>E-mail</FormLabel>
          <Input {...register("email")} type="email" value={user?.mail} />
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
            value={gender}
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
          loadingText="Editing"
        >
          Edit
        </PrimaryButton>
      </VStack>
    </>
  );
};
