import { DrawerActions } from 'react-navigation-drawer';

import { LOGOUT, LogoutAction } from '../constants';
import { DrawerActionType } from 'react-navigation-drawer/lib/typescript/src/routers/DrawerActions';

export interface DrawerState {
  isOpen: boolean;
}

export interface OpenDrawerAction {
  type: typeof DrawerActions.OPEN_DRAWER;
}

export interface CloseDrawerAction {
  type: typeof DrawerActions.CLOSE_DRAWER;
}

type DrawerActionTypes = OpenDrawerAction | CloseDrawerAction | LogoutAction;

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState: DrawerState = {
  isOpen: false,
};

function drawerReducer(state = initialState, action: DrawerActionTypes) {
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
