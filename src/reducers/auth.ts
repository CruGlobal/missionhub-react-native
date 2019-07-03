/* eslint complexity: 0, max-lines-per-function: 0 */

import {
  CLEAR_UPGRADE_TOKEN,
  FIRST_TIME,
  LOGOUT,
  UPDATE_STAGES,
  UPDATE_TOKEN,
} from '../constants';
import { userIsJean, getLocalizedStages } from '../utils/common';
import { REQUESTS } from '../api/routes';

export interface AuthState {
  isFirstTime: boolean;
  token: string;
  refreshToken: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person: any; // TODO: use GraphQL type
  isJean: boolean;
  upgradeToken: boolean | null;
}

export const initialAuthState: AuthState = {
  isFirstTime: false,
  token: '',
  refreshToken: '',
  person: { user: {} },
  isJean: false,
  upgradeToken: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function authReducer(state = initialAuthState, action: any) {
  const results = action.results;

  switch (action.type) {
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.access_token,
        refreshToken: results.refresh_token,
        isFirstTime: false,
      };
    case REQUESTS.KEY_REFRESH_TOKEN.SUCCESS:
      return {
        ...state,
        token: results.access_token,
      };
    case REQUESTS.TICKET_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        person: {
          ...state.person,
          id: `${results.person_id}`,
        },
        isFirstTime: false,
      };
    case REQUESTS.FACEBOOK_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        person: {
          ...state.person,
          id: `${results.person_id}`,
        },
        isFirstTime: false,
      };
    case FIRST_TIME:
      return {
        ...state,
        isFirstTime: true,
      };
    case REQUESTS.CREATE_MY_PERSON.SUCCESS:
      return {
        ...state,
        upgradeToken: action.data ? action.data.code : null,
        token: results.token,
        person: {
          ...state.person,
          id: `${results.person_id}`,
        },
      };
    case REQUESTS.REFRESH_ANONYMOUS_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
      };
    case REQUESTS.UPDATE_ME_USER.SUCCESS:
      return {
        ...state,
        person: {
          ...state.person,
          user: results.response,
        },
      };
    case REQUESTS.GET_ME.SUCCESS:
      const person = results.response;

      return {
        ...state,
        person: {
          ...person,
          stage: state.person.id === person.id ? state.person.stage : null, // Add the stage if we're getting the same user again
        },
        isJean: userIsJean(person.organizational_permissions),
      };
    case REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION.SUCCESS:
      return {
        ...state,
        person: {
          ...state.person,
          unread_comments_count: results.response.unread_comments_count,
        },
      };
    case REQUESTS.GET_STAGES.SUCCESS:
    case UPDATE_STAGES:
      // Add the matching 'stage' object to the user object
      const stages = getLocalizedStages(
        results ? results.response : action.stages,
      );

      return {
        ...state,
        person: {
          ...state.person,
          stage: stages.find(
            (s: { id: string }) =>
              s && s.id === `${state.person.user.pathway_stage_id}`,
          ),
        },
      };
    case UPDATE_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case CLEAR_UPGRADE_TOKEN:
      return {
        ...state,
        upgradeToken: initialAuthState.upgradeToken,
      };
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}

export default authReducer;
