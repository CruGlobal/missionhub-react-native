import { DrawerActions } from 'react-navigation-drawer';

import {
  LOGOUT,
  LogoutAction,
  MAIN_MENU_DRAWER,
  PERSON_MENU_DRAWER,
  RELOAD_APP,
} from '../constants';

export interface DrawerState {
  menuIsOpen: {
    mainMenu: boolean;
    personMenu: boolean;
  };
  mainScreenTracking: string | null;
}

export interface OpenDrawerAction {
  type: typeof DrawerActions.OPEN_DRAWER;
  drawer: string;
  mainScreenTracking: string;
}

export interface CloseDrawerAction {
  type: typeof DrawerActions.CLOSE_DRAWER;
  drawer: string;
}

// Keep track of all the swipeable rows and whether or not to show a reminder
const initialState: DrawerState = {
  menuIsOpen: {
    mainMenu: false,
    personMenu: false,
  },
  mainScreenTracking: null,
};

type DrawerActionTypes =
  | OpenDrawerAction
  | CloseDrawerAction
  | { type: typeof RELOAD_APP }
  | LogoutAction;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawerReducer(state = initialState, action: DrawerActionTypes) {
  switch (action.type) {
    case DrawerActions.OPEN_DRAWER:
      switch (action.drawer) {
        case MAIN_MENU_DRAWER:
          return {
            ...state,
            menuIsOpen: {
              ...state.menuIsOpen,
              mainMenu: true,
            },
            mainScreenTracking: action.mainScreenTracking,
          };
        case PERSON_MENU_DRAWER:
          return {
            ...state,
            menuIsOpen: {
              ...state.menuIsOpen,
              personMenu: true,
            },
          };
        default:
          return state;
      }
    case DrawerActions.CLOSE_DRAWER:
      switch (action.drawer) {
        case MAIN_MENU_DRAWER:
          return {
            ...state,
            menuIsOpen: {
              ...state.menuIsOpen,
              mainMenu: false,
            },
          };
        case PERSON_MENU_DRAWER:
          return {
            ...state,
            menuIsOpen: {
              ...state.menuIsOpen,
              personMenu: false,
            },
          };
        default:
          return state;
      }
    case RELOAD_APP:
      return initialState;
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default drawerReducer;
