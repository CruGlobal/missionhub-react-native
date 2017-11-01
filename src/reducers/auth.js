import { REHYDRATE } from 'redux-persist/constants';

import {FIRST_TIME, LOGIN, LOGOUT} from '../constants';

const initialAuthState = {
  isLoggedIn: false,
  isFirstTime: false,
};

function authReducer(state = initialAuthState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.auth;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case LOGIN:
      return { ...state, isLoggedIn: true };
    case LOGOUT:
      return { ...state, isLoggedIn: false };
    case FIRST_TIME:
      return { ...state, isFirstTime: true, isLoggedIn: false };
    default:
      return state;
  }
}

export default authReducer;