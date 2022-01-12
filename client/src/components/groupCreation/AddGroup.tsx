import React, { useEffect, useState } from "react";
import { Box,Flex,FormLabel,HStack,Button,Input,Radio,RadioGroup,Text,VStack, Checkbox, } from "@chakra-ui/react";
import { CheckboxClassKey, InputLabel } from '@material-ui/core';
import { useHistory } from 'react-router';
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { GroupsHeader } from './GroupsHeader';
import { isEmpty, valuesIn } from "lodash";
import { PrimaryButton } from "../shared/Buttons";
import { GroupImage } from "./GroupImage";
import { BsFillPersonFill  } from "react-icons/bs";

interface GroupFormFields {
    ime: string;
  }

interface User {
    ime: string
    prezime: string;
    mail: string;
}

export const AddGroup = () => {
    const { push } = useHistory();

    var [user, setUser] = useState<User>();
    let users = Array<User>();
    const [rows, setRows] = useState<User[]>([]);
    let mails = Array<string>();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<GroupFormFields>({
        defaultValues: {
        ime: "",
        },
    });

    //dohvat grupa
    const getUserData = () => {
        axios.get("http://localhost:9000/addGroup").then((response) => {
        console.log(response.data);
        
        setRows(response.data);

        });
        
    };

    // treba dohvatit
    useEffect(() => getUserData(), []);


    const input: SubmitHandler<GroupFormFields> = async (data) => {

        const allData = {
            ...data,
            mails,
          };
        console.log(allData);

        await axios.post("http://localhost:9000/addGroup", allData);

        push("/groups");
    
    };

    const handleCheckBox = (event) => {
        console.log(event.target.value);
        
        mails.push(event.target.value);
        console.log(mails);

    }

    return (
        <div>
        <GroupsHeader />
        <VStack
        align="start" minW={{base: "100vw",md: "400px",}}
        w="full" maxW={{ base: "100vw",  md: "1000px", }}
        minH={{base: "100vh", md: "400px", }}
        h="full" maxH={{ base: "100vh", md: "650px", }}
        bg="white" boxShadow={{ base: "none", md: "lg", }}
        borderRadius={{ base: "none", md: "lg", }}
        mx="auto" p="6" spacing="6"
        onSubmit={handleSubmit(input)} >
        <>
            <Flex minW="full">
                <Text fontSize="3xl" fontWeight="bold">
                Add new group
                </Text>
            </Flex>
            <HStack as="form" spacing="150" align="start" minW="full" >
                <VStack spacing="6" height={{base: "100vw",  md: "400px",}} 
                width={{base: "100vw",md: "500px", }} >
                <Flex width="100%" align="center" justify="center">
                    <FormLabel>Name of group</FormLabel>
                    <Input
                    width="50%"
                    required
                    {...register("ime")}
                    disabled={isSubmitting}
                    type="text"
                    />                    
                </Flex>

                <Flex
                display={{
                    base: "none",
                    lg: "flex",
                }}
                align="center"
                justify="center"
                direction="column"
                >
                    <GroupImage/>
                </Flex>

                <PrimaryButton
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Editing"
                    >
                    Submit
                </PrimaryButton>
                </VStack>
                
                <VStack spacing="6" style={{ overflowY: "scroll" }} height={{base: "100vw",  md: "400px",}} 
                width={{base: "100vw",md: "250px", }} alignItems="left"
                >

                    {rows.map(user => (
                        <Flex align="center">
                            <input onChange={handleCheckBox} type="checkbox" name={user?.mail} value={user?.mail} />
                            <div  style={{ paddingLeft:"3%", paddingRight:"3%"}}>
                               <BsFillPersonFill size = {20}/> 
                            </div>
                            
                            <Text> {user?.ime} {user?.prezime}</Text>
                        </Flex>
                    ))}                
                
                </VStack>
            </HStack>
            </>
        </VStack>
        </div>  
    );
};