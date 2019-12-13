import {
  ANALYTICS_CONTEXT_CHANGED,
  ANALYTICS,
  NOT_LOGGED_IN,
  LOGOUT,
} from '../constants';
import { REQUESTS } from '../api/routes';

export interface AnalyticsState {
  ['cru.mcid']: string;
  ['cru.ssoguid']: string;
  ['cru.appname']: string;
  ['cru.grmasterpersonid']: string;
  ['cru.facebookid']: string;
  ['cru.loggedinstatus']: string;
}

export const initialAnalyticsState: AnalyticsState = {
  ['cru.mcid']: '',
  ['cru.ssoguid']: '',
  ['cru.appname']: 'MissionHub App',
  ['cru.grmasterpersonid']: '',
  ['cru.facebookid']: '',
  ['cru.loggedinstatus']: 'not logged in',
};

interface AnalyticsContextChangedAction {
  type: typeof ANALYTICS_CONTEXT_CHANGED;
  analyticsContext: Partial<typeof initialAnalyticsState>;
}

interface KeyLoginSuccessAction {
  type: typeof REQUESTS.KEY_LOGIN.SUCCESS;
  results: { thekey_guid: string };
}

type AnalyticsAction =
  | AnalyticsContextChangedAction
  | KeyLoginSuccessAction
  | { type: typeof LOGOUT };

function analyticsReducer(
  state = initialAnalyticsState,
  action: AnalyticsAction,
) {
  switch (action.type) {
    case ANALYTICS_CONTEXT_CHANGED:
      return {
        ...state,
        ...(action.analyticsContext as typeof initialAnalyticsState),
      };
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        [ANALYTICS.SSO_GUID]: action.results.thekey_guid,
      };
    case LOGOUT:
      return {
        ...state,
        [ANALYTICS.SSO_GUID]: '',
        [ANALYTICS.GR_MASTER_PERSON_ID]: '',
        [ANALYTICS.FACEBOOK_ID]: '',
        [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
      };
    default:
      return state;
  }
}

export default analyticsReducer;
