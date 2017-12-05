import { REHYDRATE } from 'redux-persist/constants';

import {FIRST_TIME, LOGIN, LOGOUT} from '../constants';
import {REQUESTS} from '../actions/api';

const initialAuthState = {
  isLoggedIn: false,
  isFirstTime: false,
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyMzg1Nzk2LCJleHAiOjE1MTI0MTIwNTJ9.Bd6Ft8GZH147XxLpKZwZXfHbF00CPIeQ3GlaqfuYHe0',
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
    case REQUESTS.CREATE_MY_PERSON.SUCCESS:
      return { ...state, token: action.results.token, person_id: action.results.token};
    default:
      return state;
  }
}

export default authReducer;
