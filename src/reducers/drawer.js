import {
  LOGOUT,
  DRAWER_OPEN,
  DRAWER_CLOSE,
} from '../constants';

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState = {
  isOpen: false,
};

function drawerReducer(state = initialState, action) {
  switch (action.routeName) {
    case DRAWER_OPEN:
      return { ...state, isOpen: true };
    case DRAWER_CLOSE:
      return { ...state, isOpen: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default drawerReducer;
