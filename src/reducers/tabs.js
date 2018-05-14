import {
  MAIN_TAB_CHANGED,
  CONTACT_TAB_CHANGED, LOGIN_TAB_CHANGED, PERSON_VIEWED_STAGE_CHANGED, SELF_VIEWED_STAGE_CHANGED,
} from '../constants';
import { stepsTab } from '../AppRoutes';

//These are used to indicate what tab/stage the user will view when navigating back.
const initialTabsState = {
  activeLoginTab: '',
  activeMainTab: stepsTab,
  activeContactTab: '',
  activePersonStageTab: '',
  activeSelfStageTab: '',
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
    case PERSON_VIEWED_STAGE_CHANGED:
      return {
        ...state,
        activePersonStageTab: action.newActiveTab,
      };
    case SELF_VIEWED_STAGE_CHANGED:
      return {
        ...state,
        activeSelfStageTab: action.newActiveTab,
      };
    default:
      return state;
  }
}
