import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Authentification from "pages/Authentification";
import NewSurvey from "pages/NewSurvey";
import Surveys from "components/Surveys";
import ProfilePage from "pages/ProfilePage";
import Groups from "components/Groups";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SurveyPage from "pages/SurveyPage";
import { AddGroup } from "components/AddGroup";

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
          <Route path={["/", "/surveys"]} exact>
            <Surveys />
          </Route>
          <Route path="/new-survey" exact>
            <NewSurvey />
          </Route>
          <Route path="/survey" exact>
            <SurveyPage />
          </Route>
          <Route path="/profile" exact>
            <ProfilePage />
          </Route>
          <Route path="/groups" exact>
            <Groups />
          </Route>
          <Route path="/addGroup" exact>
            <AddGroup />
          </Route>
        </Switch>
      </ChakraProvider>
    </Router>
  );
};
