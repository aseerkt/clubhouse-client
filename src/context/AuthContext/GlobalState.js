import { createContext, useReducer, useContext } from "react";
import AppReducer from "./AppReducer";
const initial_data = {
  user: {},
  token: null,
  infotimeout: null,
  infoalert: "",

  errortimeout: null,
  
  erroralert: "",
};

export const GlobalContext = createContext(initial_data);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initial_data);

  async function loginuser(details, logout) {
    if (logout) {
      await localStorage.removeItem("hackathon")
    } else {
      await localStorage.setItem("hackathon", details.token);
    }
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
  function updateerroralert(data) {

    
    clearTimeout(state.errortimeout);
    const timeout = setTimeout(function () {
      dispatch({
        type: "ERROR_ALERT",
        payload: {message:null,timeout:null },
      });
    }, 3000);
    dispatch({
      type: "ERROR_ALERT",
      payload: {message:data,timeout:timeout},
    });
  }
  function updateinfoalert(data) {
    // clearTimeout(state.infotimeout);
    // const timeout = setTimeout(function () {
    //   dispatch({
    //     type: "INFO_ALERT",
    //     payload: {message:null,timeout:timeout},
    //   });
    // }, 3000);
    dispatch({
      type: "INFO_ALERT",
      payload: {message:data},
    });
  }
  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        token: state.token,
        infoalert: state.infoalert,
        erroralert:state.erroralert,
        loginuser,
        updateuser,
        updateinfoalert,
        updateerroralert,
        
        
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export function useAuthState() {
  return useContext(GlobalContext);
}
