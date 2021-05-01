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
      default:
        return;
    }
  };