import { REHYDRATE } from 'redux-persist/constants';
import { LOGOUT, FIRST_NAME_CHANGED, LAST_NAME_CHANGED } from '../constants';
import { REQUESTS } from '../actions/api';
import { NAME } from '../constants';

const initialProfileState = {
  firstName: '',
  lastName: '',
};

function profileReducer(state = initialProfileState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.profile;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case NAME:
      return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
      };
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
        firstName: action.results.first_name,
        lastName: action.results.last_name,
      };
    case LOGOUT:
      return initialProfileState;
    default:
      return state;
  }
}

export default profileReducer;