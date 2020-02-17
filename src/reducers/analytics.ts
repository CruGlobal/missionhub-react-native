import i18next from 'i18next';

import {
  ANALYTICS_CONTEXT_CHANGED,
  ANALYTICS,
  NOT_LOGGED_IN,
  LOGOUT,
  RELOAD_APP,
} from '../constants';
import { REQUESTS } from '../api/routes';
import {
  RESET_APP_CONTEXT,
  ResetAppContextAction,
  SET_APP_CONTEXT,
  SetAppContextAction,
  SectionTypeValue,
  AssignmentTypeValue,
  EditModeValue,
  PermissionTypeValue,
} from '../actions/analytics';

const {
  MCID,
  PREVIOUS_SCREEN_NAME,
  APP_NAME,
  LOGGED_IN_STATUS,
  SSO_GUID,
  GR_MASTER_PERSON_ID,
  FACEBOOK_ID,
  CONTENT_LANGUAGE,
  SECTION_TYPE,
  ASSIGNMENT_TYPE,
  EDIT_MODE,
  PERMISSION_TYPE,
  MINISTRY_MODE,
} = ANALYTICS;

export const initialAnalyticsState = {
  [MCID]: '',
  [PREVIOUS_SCREEN_NAME]: '',
  [APP_NAME]: 'MissionHub App',
  [LOGGED_IN_STATUS]: NOT_LOGGED_IN,
  [SSO_GUID]: '',
  [GR_MASTER_PERSON_ID]: '',
  [FACEBOOK_ID]: '',
  [CONTENT_LANGUAGE]: i18next.language,
  [SECTION_TYPE]: '' as SectionTypeValue,
  [ASSIGNMENT_TYPE]: '' as AssignmentTypeValue,
  [EDIT_MODE]: '' as EditModeValue,
  [PERMISSION_TYPE]: '' as PermissionTypeValue,
  [MINISTRY_MODE]: false,
};

export type AnalyticsState = typeof initialAnalyticsState;

interface AnalyticsContextChangedAction {
  type: typeof ANALYTICS_CONTEXT_CHANGED;
  analyticsContext: Partial<AnalyticsAction>;
}

interface KeyLoginSuccessAction {
  type: typeof REQUESTS.KEY_LOGIN.SUCCESS;
  results: { thekey_guid: string };
}

type AnalyticsAction =
  | AnalyticsContextChangedAction
  | KeyLoginSuccessAction
  | SetAppContextAction
  | ResetAppContextAction
  | { type: typeof RELOAD_APP }
  | { type: typeof LOGOUT };

function analyticsReducer(
  state = initialAnalyticsState,
  action: AnalyticsAction,
) {
  switch (action.type) {
    case ANALYTICS_CONTEXT_CHANGED:
      return {
        ...state,
        ...(action.analyticsContext as AnalyticsState),
      };
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        [ANALYTICS.SSO_GUID]: action.results.thekey_guid,
      };
    case SET_APP_CONTEXT:
      return {
        ...state,
        ...action.context,
      };
    case RESET_APP_CONTEXT:
      return {
        ...state,
        [SECTION_TYPE]: '',
        [ASSIGNMENT_TYPE]: '',
        [EDIT_MODE]: '',
        [PERMISSION_TYPE]: '',
        [MINISTRY_MODE]: false,
      };
    case RELOAD_APP:
      return {
        ...state,
        [ANALYTICS.PREVIOUS_SCREEN_NAME]: '',
      };
    case LOGOUT:
      return initialAnalyticsState;
    default:
      return state;
  }
}

export default analyticsReducer;
