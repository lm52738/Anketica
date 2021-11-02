import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Hero } from "components/Hero";
import { Auth } from "components/Auth";

export const App = () => {
  return (
    <ChakraProvider resetCSS>
      <Hero />
      <Auth />
    </ChakraProvider>
  );
};
