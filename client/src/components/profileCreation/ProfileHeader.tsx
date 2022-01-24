import { extendTheme } from "@chakra-ui/react";
import React from "react";
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

export const ProfileHeader = () => {
  return (
     <Flex justify="space-evenly" direction="row" alignItems = 'stretch' width="100%">
       <Flex alignSelf="baseline" justify="left">
           <PersistentDrawerLeft/>
        </Flex>
        <Flex width = '50%' alignSelf = 'baseline'></Flex>
     </Flex>
     
    
  );
};