import { REHYDRATE } from 'redux-persist/constants';

import { FIRST_TIME, LOGOUT, UPDATE_STAGES } from '../constants';
import { REQUESTS } from '../actions/api';
import { findAllNonPlaceHolders } from '../utils/common';

const initialAuthState = {
  isLoggedIn: false,
  isFirstTime: false,
  token: '',
  refreshToken: '',
  personId: '',
  user: {},
  isJean: false,
  upgradeToken: null,
};

function authReducer(state = initialAuthState, action) {
  const results = action.results;

  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.auth;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.access_token,
        refreshToken: results.refresh_token,
        isLoggedIn: true,
        isFirstTime: false,
      };
    case REQUESTS.KEY_REFRESH_TOKEN.SUCCESS:
      return {
        ...state,
        token: results.access_token,
        isLoggedIn: true,
      };
    case REQUESTS.TICKET_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        personId: `${results.person_id}`,
        isLoggedIn: true,
        isFirstTime: false,
      };
    case REQUESTS.FACEBOOK_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        personId: `${results.person_id}`,
        isLoggedIn: true,
        isFirstTime: false,
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
        upgradeToken: action.data ? action.data.code : null,
        isLoggedIn: true,
        token: results.token,
        personId: `${results.person_id}`,
      };
    case REQUESTS.REFRESH_ANONYMOUS_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
      };
    case REQUESTS.UPDATE_ME_USER.SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          user: results.response,
        },
      };
    case REQUESTS.GET_ME.SUCCESS:
      const person = findAllNonPlaceHolders(results, 'person')[0];

      let user = person || {};
      // Add the stage if we're getting the same user again
      if (state.user.stage && state.user.id === user.id) {
        user.stage = state.user.stage;
      }

      return {
        ...state,
        personId: `${user.id}`,
        user,
        isJean: person.organizational_permissions.length > 0,
      };
    case REQUESTS.GET_STAGES.SUCCESS:
    case UPDATE_STAGES:
      // Add the matching 'stage' object to the user object
      const stages = (results ? results.findAll('pathway_stage') : action.stages) || [];
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
