import { DrawerActions } from 'react-navigation';

import { LOGOUT } from '../constants';

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState = {
  isOpen: false,
};

function drawerReducer(state = initialState, action) {
  if (action.type === DrawerActions.OPEN_DRAWER) {
    return { ...state, isOpen: true };
  } else if (action.type === DrawerActions.CLOSE_DRAWER) {
    return { ...state, isOpen: false };
  }
  switch (action.type) {
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default drawerReducer;
