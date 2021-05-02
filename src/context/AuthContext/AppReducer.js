/* eslint-disable import/no-anonymous-default-export */
export default (state, action) => {
    switch (action.type) {
      case "LOGIN_USER":
        return {
          ...state,
          user: action.payload.user,
          token:action.payload.token
        };
        case "UPDATE_USER":
          return {
            ...state,
            user: action.payload,
        };
      case "ERROR_ALERT":
          return {
            ...state,
            erroralert: action.payload.message,
            errortimeout: action.payload.timeout,
        };
        case "INFO_ALERT":
          return {
            ...state,
            infoalert: action.payload.message,
            infotimeout: action.payload.timeout,
          };
      default:
        return;
    }
  };