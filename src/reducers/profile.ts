import {
  LOGOUT,
  FIRST_NAME_CHANGED,
  LAST_NAME_CHANGED,
  STASH_COMMUNITY_TO_JOIN,
} from '../constants';
import { REQUESTS } from '../api/routes';

export interface ProfileState {
  firstName: string;
  lastName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  community: any; // TODO: use GraphQL type
}

const initialProfileState: ProfileState = {
  firstName: '',
  lastName: '',
  community: {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function profileReducer(state = initialProfileState, action: any) {
  const results = action.results;

  switch (action.type) {
    case FIRST_NAME_CHANGED:
      return {
        ...state,
        firstName: action.firstName,
      };
    case LAST_NAME_CHANGED:
      return {
        ...state,
        lastName: action.lastName,
      };
    case REQUESTS.CREATE_MY_PERSON.SUCCESS:
      return {
        ...state,
        firstName: results.first_name,
        lastName: results.last_name,
      };
    case REQUESTS.TICKET_LOGIN.SUCCESS:
      return {
        ...state,
        firstName: results.first_name,
        lastName: results.last_name,
      };
    case REQUESTS.FACEBOOK_LOGIN.SUCCESS:
      return {
        ...state,
        firstName: results.first_name,
        lastName: results.last_name,
      };
    case STASH_COMMUNITY_TO_JOIN:
      const { community } = action;
      return { ...state, community };
    case LOGOUT:
      return initialProfileState;
    default:
      return state;
  }
}

export default profileReducer;
