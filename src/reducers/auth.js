import { REHYDRATE } from 'redux-persist/constants';

import { FIRST_TIME, LOGIN, LOGOUT, LOGIN_WITH_MINISTRIES } from '../constants';
import { REQUESTS } from '../actions/api';

const initialAuthState = {
  isLoggedIn: false,
  isFirstTime: false,
  token: '',
  personId: '',
  hasMinistries: false,
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
    case LOGIN_WITH_MINISTRIES:
      return {
        ...state,
        hasMinistries: true,
        isLoggedIn: true,
      };
    case FIRST_TIME:
      return { ...state, isFirstTime: true, isLoggedIn: false };
    case REQUESTS.CREATE_MY_PERSON.SUCCESS:
      LOG('action', action.results);
      return {
        ...state,
        isLoggedIn: true,
        token: action.results.token,
        personId: `${action.results.person_id}`,
      };
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}

export default authReducer;
