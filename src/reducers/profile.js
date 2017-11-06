import { NAME } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';
import {FIRST_NAME_CHANGED} from '../constants';
import {LAST_NAME_CHANGED} from '../constants';

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
      return { ...state, firstName: action.firstName, lastName: action.lastName };
    case FIRST_NAME_CHANGED:
      return { ...state, firstName: action.firstName };
    case LAST_NAME_CHANGED:
      return { ...state, lastName: action.lastName };
    default:
      return state;
  }
}

export default profileReducer;