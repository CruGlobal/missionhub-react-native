import { DrawerActions } from 'react-navigation-drawer';

import { LOGOUT } from '../constants';

export interface DrawerState {
  isOpen: boolean;
  mainScreenTracking: string | null;
}

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState: DrawerState = {
  isOpen: false,
  mainScreenTracking: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawerReducer(state = initialState, action: any) {
  switch (action.type) {
    case DrawerActions.OPEN_DRAWER:
      return {
        ...state,
        isOpen: true,
        mainScreenTracking: action.mainScreenTracking,
      };
    case DrawerActions.CLOSE_DRAWER:
      return { ...state, isOpen: false };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default drawerReducer;
