import {
  MAIN_TAB_CHANGED,
  PERSON_VIEWED_STAGE_CHANGED,
  SELF_VIEWED_STAGE_CHANGED,
  GROUP_TAB_CHANGED,
} from '../constants';
import { stepsTab } from '../AppRoutes';

/*
These are used by analytics to indicate what tab/stage the user will view when navigating back since we can't get this
data from the navigation state.  See src/middleware/tracking.js for more context.
 */
const initialTabsState = {
  activeLoginTab: '',
  activeMainTab: stepsTab,
  activeContactTab: '',
};

export default function tabsReducer(state = initialTabsState, action) {
  switch (action.type) {
    case MAIN_TAB_CHANGED:
      return {
        ...state,
        activeMainTab: action.newActiveTab,
      };
    case GROUP_TAB_CHANGED:
      return {
        ...state,
        activeGroupTab: action.newActiveTab,
      };
    default:
      return state;
  }
}
