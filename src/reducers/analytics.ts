import i18next from 'i18next';

import {
  ANALYTICS_CONTEXT_CHANGED,
  NOT_LOGGED_IN,
  LOGOUT,
  RELOAD_APP,
} from '../constants';
import { REQUESTS } from '../api/routes';
import {
  RESET_APP_CONTEXT,
  ResetAppContextAction,
  TrackStateContext,
} from '../actions/analytics';

export interface AnalyticsState {
  'cru.mcid': TrackStateContext['cru.mcid'];
  'cru.previousscreenname': TrackStateContext['cru.previousscreenname'];
  'cru.appname': TrackStateContext['cru.appname'];
  'cru.loggedinstatus': TrackStateContext['cru.loggedinstatus'];
  'cru.ssoguid': TrackStateContext['cru.ssoguid'];
  'cru.grmasterpersonid': TrackStateContext['cru.grmasterpersonid'];
  'cru.facebookid': TrackStateContext['cru.facebookid'];
  'cru.contentlanguage': TrackStateContext['cru.contentlanguage'];
  'cru.section-type': TrackStateContext['cru.section-type'];
  'cru.assignment-type': TrackStateContext['cru.assignment-type'];
  'cru.edit-mode': TrackStateContext['cru.edit-mode'];
  'cru.permission-type': TrackStateContext['cru.permission-type'];
  'cru.ministry-mode': TrackStateContext['cru.ministry-mode'];
}

export const initialAnalyticsState: AnalyticsState = {
  'cru.mcid': '',
  'cru.previousscreenname': '',
  'cru.appname': 'MissionHub App',
  'cru.loggedinstatus': NOT_LOGGED_IN,
  'cru.ssoguid': '',
  'cru.grmasterpersonid': '',
  'cru.facebookid': '',
  'cru.contentlanguage': i18next.language,
  'cru.section-type': '',
  'cru.assignment-type': '',
  'cru.edit-mode': '',
  'cru.permission-type': '',
  'cru.ministry-mode': false,
};

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
        'cru.ssoguid': action.results.thekey_guid,
      };
    case RESET_APP_CONTEXT:
      return {
        ...state,
        'cru.section-type': '',
        'cru.assignment-type': '',
        'cru.edit-mode': '',
        'cru.permission-type': '',
        'cru.ministry-mode': false,
      };
    case RELOAD_APP:
      return {
        ...state,
        'cru.previousscreenname': '',
      };
    case LOGOUT:
      return initialAnalyticsState;
    default:
      return state;
  }
}

export default analyticsReducer;
