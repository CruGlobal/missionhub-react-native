import { NAME } from '../constants';

const initialProfileState = {
  firstName: '',
  lastName: '',
};

function profileReducer(state = initialProfileState, action) {
  switch (action.type) {
    case NAME:
      return { ...state, firstName: action.payload.firstName, lastName: action.payload.lastName };
    default:
      return state;
  }
}

export default profileReducer;