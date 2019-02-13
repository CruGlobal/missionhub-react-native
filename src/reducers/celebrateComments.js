import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

export default function celebrateCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
