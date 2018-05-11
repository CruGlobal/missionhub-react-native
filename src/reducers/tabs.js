import {
  MAIN_TAB_CHANGED,
  CONTACT_TAB_CHANGED, LOGIN_TAB_CHANGED,
} from '../constants';
import { stepsTab } from '../AppRoutes';

const initialTabsState = {
  activeLoginTab: '',
  activeMainTab: stepsTab,
  activeContactTab: '',
};

export default function tabsReducer(state = initialTabsState, action) {
  switch (action.type) {
    case LOGIN_TAB_CHANGED:
      return {
        ...state,
        activeLoginTab: action.newActiveTab,
      };
    case MAIN_TAB_CHANGED:
      return {
        ...state,
        activeMainTab: action.newActiveTab,
      };
    case CONTACT_TAB_CHANGED:
      return {
        ...state,
        activeContactTab: action.newActiveTab,
      };
    default:
      return state;
  }
}
