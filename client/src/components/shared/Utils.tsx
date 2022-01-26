import { useHistory, useLocation } from "react-router-dom";

export const isAuthenticated: () => boolean = () => {
  return localStorage.getItem("user") != null;
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
  } catch (err) {}
};

export const useRedirect = () => {
  const { push } = useHistory();
  const location = useLocation();

  if (isAuthenticated() && location.pathname === "/") {
    push("/surveys");
  } else if (!isAuthenticated() && location.pathname !== "/") {
    push("/");
  }
};
