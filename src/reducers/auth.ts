import {
  CLEAR_UPGRADE_TOKEN,
  LOGOUT,
  UPDATE_STAGES,
  UPDATE_TOKEN,
} from '../constants';
import { REQUESTS } from '../api/routes';

import { Person } from './people';

export interface User {
  id: string;
  __type: 'user';
}

export interface AuthState {
  token?: string;
  refreshToken: string;
  person: Person;
  upgradeToken: string | null;
}

const initialAuthState: AuthState = {
  token: undefined,
  refreshToken: '',
  person: { user: {} },
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
      };
    case REQUESTS.FACEBOOK_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        person: {
          ...state.person,
          id: `${results.person_id}`,
        },
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
      // If an API call is slow and then FAILS, we refresh the anon login token. If a user logs out while that is happening, they could get stuck in an online state.
      if (state.token === '') {
        return state;
      }
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
    case REQUESTS.GET_ME.SUCCESS: {
      const person = results.response;

      return {
        ...state,
        person: {
          ...person,
          stage: state.person.id === person.id ? state.person.stage : null, // Add the stage if we're getting the same user again
        },
      };
    }
    case REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION.SUCCESS:
      return {
        ...state,
        person: {
          ...state.person,
          unread_comments_count: results.response.unread_comments_count,
        },
      };
    case REQUESTS.GET_STAGES.SUCCESS:
    case UPDATE_STAGES: {
      // Add the matching 'stage' object to the user object
      const stages = results ? results.response : action.stages;

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
    }
    case UPDATE_TOKEN:
      // If an API call is slow and then finishes after a user logs out, it would cause the user to be stuck in an online state. This will prevent that state from happening.
      if (state.token === '') {
        return state;
      }
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
