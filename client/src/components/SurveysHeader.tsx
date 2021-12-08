import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Button from '@mui/material/Button';
import React from "react";
import { FaBeer } from "@react-icons/all-files/fa/FaBeer";
import { BsFillPersonFill  } from "react-icons/bs";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const theme = extendTheme({
  colors: {
    "primary-100": "#5D5FEF",
    "primary-80": "#7879F1",
    "primary-60": "#A5A6F6",
    secondary: "",
    accent: "",
  },

  styles: {
    global: {
      "html, body, #root": {
        height: "full",
        background: "#F6F8FB",
      },
    },
  },
});

export const SurveysHeader = () => {
  return (
     <Flex justify="space-evenly" direction="row" alignItems = 'stretch'>
        <Flex width = '50%' alignSelf = 'baseline'> 
         <Text fontSize = {35} >
         Anketica
         </Text >
        </Flex>
        <Flex alignItems  ='flex-end'>
         <Text fontSize = {30} >
         Ime i Prezime
         </Text >
         <a href='/profile'>
            <BsFillPersonFill size = {50}/>  
         </a> 
         
         </Flex>
     </Flex>
     
    
  );
};
