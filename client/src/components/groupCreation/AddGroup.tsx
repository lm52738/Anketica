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

interface GroupFormFields {
    ime: string;
  }

interface mail {
    mail: string;
}

export const AddGroup = () => {
    const { push } = useHistory();

    var [mail, setMail] = useState<mail>();
    let mails = Array<string>();
    const [rows, setRows] = useState<string[]>([]);
    let newMails = Array<string>();

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
        
        for (mail of response.data){
            if (mail)
                mails.push(mail?.mail);
        }
    
        console.log(mails)

        if (!isEmpty(mails))
            setRows(mails);
        });
    };

    // treba dohvatit
    useEffect(() => getUserData(), []);


    const input: SubmitHandler<GroupFormFields> = async (data) => {

        const allData = {
            ...data,
            newMails,
          };
        console.log(allData);

        await axios.post("http://localhost:9000/addGroup", allData);

        push("/groups");
    
    };

    const handleCheckBox = (event) => {
        console.log(event.target.value);
        
        newMails.push(event.target.value);
        console.log(newMails);

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
            <HStack as="form" spacing="90" align="start" minW="full" >
                <VStack spacing="6" height={{base: "100vw",  md: "400px",}} 
                width={{base: "100vw",md: "500px", }} >
                <Box>
                    <FormLabel>Name of group</FormLabel>
                    <Input
                    required
                    {...register("ime")}
                    disabled={isSubmitting}
                    type="text"
                    />
                </Box>

                <Box
                display={{
                    base: "none",
                    lg: "flex",
                }}
                align="center"
                justify="center"
                direction="column"
                >
                    <GroupImage/>
                </Box>

                <PrimaryButton
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Editing"
                    >
                    Submit
                </PrimaryButton>
                </VStack>
                
                <VStack spacing="4" style={{ overflowY: "scroll" }} height={{base: "100vw",  md: "400px",}} 
                width={{base: "100vw",md: "350px", }} 
                >

                    {rows.map(mail => (
                        <div><input onChange={handleCheckBox} type="checkbox" name={mail} value={mail} /> {mail}</div>
                    ))}                
                
                </VStack>
            </HStack>
            </>
        </VStack>
        </div>  
    );
};