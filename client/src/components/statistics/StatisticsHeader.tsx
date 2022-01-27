import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsFillPersonFill  } from "react-icons/bs";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as React from 'react';
import PersistentDrawerLeft from "../Drawer2";



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

interface Pitanje {
  ime: string;
  id: number;
  tekst: string;
  id_tip_pitanja: number;
}

  export const StatisticsHeader = () => {
    const {id}  = useParams();
    const [pitanje, setPitanje] = useState<Pitanje[]>([]);

  const getUserData = () => {
    const url = "http://localhost:9000/statistics/" + id;
    axios.get(url).then((response) => {
      console.log(response.data);
      setPitanje(response.data);
      console.log(pitanje[0]?.ime);
    });

  };

  // treba dohvatit
  useEffect(() => getUserData(), []);
  
    return (
       <Flex justify="space-evenly" direction="row" alignItems = 'stretch'>
         <Flex><PersistentDrawerLeft/></Flex>
          <Flex width = '50%' alignSelf = 'baseline'> 
           <Text fontSize = {35} >
           {pitanje[0]?.ime}
           </Text >
          </Flex>
       </Flex>      
    );
  };