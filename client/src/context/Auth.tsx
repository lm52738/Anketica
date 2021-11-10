import React, { createContext, FC, useContext } from "react";

interface AuthContext {}

const authContext = createContext<AuthContext>({});

export const AuthProvider: FC = ({ children }) => {
  return <authContext.Provider value={{}}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("component has to be child of AuthProvider");
  }

  return context;
};
