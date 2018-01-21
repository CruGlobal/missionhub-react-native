import { REHYDRATE } from 'redux-persist/constants';

import { FIRST_TIME, LOGIN, LOGOUT, LOGIN_WITH_MINISTRIES } from '../constants';
import { REQUESTS } from '../actions/api';

const initialAuthState = {
  isLoggedIn: false,
  isFirstTime: false,
  token: '',
  refreshToken: '',
  personId: '',
  hasMinistries: false,
  user: {},
};

function authReducer(state = initialAuthState, action) {
  const results = action.results;

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
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGIN_WITH_MINISTRIES:
      return {
        ...state,
        hasMinistries: true,
        isLoggedIn: true,
      };
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.access_token,
        refreshToken: results.refresh_token,
        isLoggedIn: true,
      };
    case REQUESTS.TICKET_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        personId: `${results.person_id}`,
        isLoggedIn: true,
      };
    case REQUESTS.FACEBOOK_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        personId: `${results.person_id}`,
        isLoggedIn: true,
      };
    case FIRST_TIME:
      return {
        ...state,
        isFirstTime: true,
        isLoggedIn: false,
      };
    case REQUESTS.CREATE_MY_PERSON.SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: results.token,
        personId: `${results.person_id}`,
      };
    case REQUESTS.GET_ME.SUCCESS:
      let user = (results.findAll('person') || [])[0] || {};
      // Add the stage if we're getting the same user again
      if (state.user.stage && state.user.id === user.id) {
        user.stage = state.user.stage;
      }
      return {
        ...state,
        personId: `${user.id}`,
        user,
        // hasMinistries: true,
      };

    case REQUESTS.GET_STAGES.SUCCESS:
      // Add the matching 'stage' object to the user object
      const stages = results.findAll('pathway_stage') || [];
      let userWithStage = { ...state.user };
      if (userWithStage.user && userWithStage.user.pathway_stage_id) {
        const myStage = stages.find((s) => `${s.id}` === `${userWithStage.user.pathway_stage_id}`);
        if (myStage) {
          userWithStage.stage = myStage;
        }
      }
      return {
        ...state,
        user: userWithStage,
      };
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}

export default authReducer;
