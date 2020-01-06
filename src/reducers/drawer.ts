import { DrawerActions } from 'react-navigation-drawer';

import { LOGOUT, LogoutAction, RELOAD_APP } from '../constants';

export interface DrawerState {
  isOpen: boolean;
}

export interface OpenDrawerAction {
  type: typeof DrawerActions.OPEN_DRAWER;
}

export interface CloseDrawerAction {
  type: typeof DrawerActions.CLOSE_DRAWER;
}

type DrawerActionTypes =
  | OpenDrawerAction
  | CloseDrawerAction
  | { type: typeof RELOAD_APP }
  | LogoutAction;

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState: DrawerState = {
  isOpen: false,
};

function drawerReducer(state = initialState, action: DrawerActionTypes) {
  switch (action.type) {
    case DrawerActions.OPEN_DRAWER:
      return { ...state, isOpen: true };
    case DrawerActions.CLOSE_DRAWER:
      return { ...state, isOpen: false };
    case RELOAD_APP:
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default drawerReducer;
