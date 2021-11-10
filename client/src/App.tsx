import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Authentification from "pages/Authentification";
import NewSurvey from "pages/NewSurvey";
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
            <Authentification />
          </Route>
          <Route path="/new-survey" exact>
            <NewSurvey />
          </Route>
        </Switch>
      </ChakraProvider>
    </Router>
  );
};
