import { Box, ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { Auth } from "components/auth/Auth";
import { Header } from "components/Header";
import { Hero } from "components/Hero";
import { NewSurveyForm } from "components/WIP";
import React from "react";
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

export const App = () => {
  return (
    <Router>
      <ChakraProvider resetCSS theme={theme}>
        <Switch>
          <Route path={["/", "/home"]} exact>
            <Flex
              h="full"
              direction="row"
              justify="space-between"
              align="center"
              p={{
                base: 0,
                md: "6",
              }}
            >
              <Hero />
              <Auth />
            </Flex>
          </Route>
          <Route path="/new-survey" exact>
            <Header />
            <NewSurveyForm />
          </Route>
        </Switch>
      </ChakraProvider>
    </Router>
  );
};
