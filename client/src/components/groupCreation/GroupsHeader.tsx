import { extendTheme } from "@chakra-ui/react";
import React from "react";
import { BsFillPersonFill  } from "react-icons/bs";
import { Text, Flex } from "@chakra-ui/react";
import PersistentDrawerLeft from "components/Drawer2";


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

export const GroupsHeader = () => {
  return (
     <Flex justify="space-evenly" direction="row" alignItems = 'stretch'>
       <Flex><PersistentDrawerLeft/></Flex>
        <Flex width = '50%' alignSelf = 'baseline'> 
         <Text fontSize = {35} >
         Anketica
         </Text >
        </Flex>
        <Flex alignItems  ='flex-end'>
         <Text fontSize = {30} >
         Admin
         </Text >
         <a>
            <BsFillPersonFill size = {50}/>  
         </a> 
         
         </Flex>
     </Flex>
     
    
  );
};