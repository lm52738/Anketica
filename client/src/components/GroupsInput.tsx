import React from "react";
import { Box,Flex,FormLabel,HStack,Button,Input,Radio,RadioGroup,Text,VStack, } from "@chakra-ui/react";
import { InputLabel } from '@material-ui/core';

export const GroupsInput = () => {
  return (   
        <form
        style={{
            textAlign: 'left' 
        }}
        >
            <label>
                Name of group:
                <input type="text" name="name" placeholder="    Insert name" />
            </label>
            <label>
                Mails (split by ", "):
                <input style={{ width: "600px" }} type="text" name="mails" placeholder="    surname1.name@mail.com, surname2.name@mail.com"/>
            </label>            
            <Button type="submit" value="Submit">Add new group</Button>
        </form>
  );
};