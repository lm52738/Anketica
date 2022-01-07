import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsFillPersonFill  } from "react-icons/bs";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

interface Anketa {
  id: number;
  ime: string;
}

  export const StatisticsHeader = () => {
    const { id } = useParams();
    var [anketa, setAnketa] = useState<Anketa>();

  const getUserData = () => {
    const url = "http://localhost:9000/statistics/" + id;
    axios.get<Anketa>(url).then((response) => {
      console.log(response.data);
      setAnketa(response.data);
    });

  };

  // treba dohvatit
  useEffect(() => getUserData(), []);
  
    return (
       <Flex justify="space-evenly" direction="row" alignItems = 'stretch'>
          <Flex width = '50%' alignSelf = 'baseline'> 
           <Text fontSize = {35} >
           Ime Ankete {anketa?.ime}
           </Text >
          </Flex>
       </Flex>      
    );
  };