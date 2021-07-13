import { AUTH_ERROR, AUTH_LOGIN, AUTH_LOGOUT } from "../actions/types";

const INITIAL_STATE = {
  authenticated: { user: "", permisson: "", isLoggedIn: false },
  error: "",
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        authenticated: {
          user: action.payload,
          permission: action.payload.permission,
          isLoggedIn: true,
        },
      };
    // case AUTH_LOGIN_REPORTS:
    //   return {
    //     ...state,
    //     authenticated: {
    //       ...state.authenticated,
    //       reports: action.payload,
    //     },
    //   };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case AUTH_LOGOUT:
      return {
        authenticated: { user: "", permisson: "", isLoggedIn: false },
        error: "",
      };
    default:
      return state;
  }
}
