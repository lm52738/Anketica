import React, { useEffect, useState } from "react";
import { Box,Flex,FormLabel,HStack,Button,Input,Radio,RadioGroup,Text,VStack, Checkbox, } from "@chakra-ui/react";
import { CheckboxClassKey, InputLabel } from '@material-ui/core';
import { useHistory } from 'react-router';
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { GroupsHeader } from './GroupsHeader';
import { isEmpty, valuesIn } from "lodash";
import { PrimaryButton } from "./shared/Buttons";

interface GroupFormFields {
    ime: string;
    mails: Array<string>;
  }

interface mail {
    mail: string;
}

export const AddGroup = () => {

    var [mail, setMail] = useState<mail>();
    let mails = Array<string>();
    const [rows, setRows] = useState<string[]>([]);
    let newMails = Array<string>();
    const [data, setData] = useState<FormData>();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<GroupFormFields>({
        defaultValues: {
        ime: "",
        mails: [],
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

        console.log(data);

        //window.location.reload();
        //await axios.post("http://localhost:9000/addGroup", data);
    
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
        align="start" minW={{base: "100vw",md: "1000px",}}
        w="full" maxW={{ base: "100vw",  md: "400px", }}
        minH={{base: "100vh", md: "400px", }}
        h="full" maxH={{ base: "100vh", md: "650px", }}
        bg="white" boxShadow={{ base: "none", md: "lg", }}
        borderRadius={{ base: "none", md: "lg", }}
        marginTop={{ md:"50px" }} 
        mx="auto" p="6" spacing="6"
        onSubmit={handleSubmit(input)} >
        <>
            <Flex minW="full">
                <Text fontSize="3xl" fontWeight="bold">
                Add new group
                </Text>
            </Flex>
            <HStack as="form" spacing="200" align="start" minW="full" >
                <VStack>
                <Box>
                    <FormLabel>Name of group</FormLabel>
                    <Input
                    required
                    {...register("ime")}
                    disabled={isSubmitting}
                    type="text"
                    />
                </Box>
                
                <PrimaryButton
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="Editing"
                    >
                    Submit
                </PrimaryButton>
                </VStack>
                
                <VStack spacing="6" style={{ overflowY: "scroll" }} height={{base: "100vw",  md: "400px",}} 
                width={{base: "100vw",md: "400px", }} 
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