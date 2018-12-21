import {
  LOGOUT,
  FIRST_NAME_CHANGED,
  LAST_NAME_CHANGED,
  STASH_COMMUNITY_TO_JOIN,
} from '../constants';
import { REQUESTS } from '../actions/api';

const initialProfileState = {
  firstName: '',
  lastName: '',
  community: {},
};

function profileReducer(state = initialProfileState, action) {
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
