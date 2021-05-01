import { createContext, useReducer, useContext } from "react";
import AppReducer from "./AppReducer";
const initial_data = {
  user: {},
  token: null,
};

export const GlobalContext = createContext(initial_data);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initial_data);

  async function loginuser(details) {
    await localStorage.setItem("hackathon", details.token);
    dispatch({
      type: "LOGIN_USER",
      payload: details,
    });
  }

  function updateuser(user) {
    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        token: state.token,
        loginuser,
        updateuser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export function useAuthState() {
  return useContext(GlobalContext);
}
