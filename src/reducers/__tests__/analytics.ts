import analyticsReducer, {
  initialAnalyticsState,
  AnalyticsState,
  AnalyticsContextChangedAction,
} from '../analytics';
import {
  ANALYTICS_PREVIOUS_SCREEN_NAME,
  ANALYTICS_LOGGED_IN_STATUS,
  ANALYTICS_SSO_GUID,
  ANALYTICS_GR_MASTER_PERSON_ID,
  ANALYTICS_FACEBOOK_ID,
  ANALYTICS_CONTENT_LANGUAGE,
  LOGOUT,
  NOT_LOGGED_IN,
  RELOAD_APP,
} from '../../constants';
import { REQUESTS } from '../../api/routes';
import { SET_NOTIFICATION_ANALYTICS } from '../../actions/notifications';
import { ANALYTICS_CONTEXT_CHANGED } from '../../actions/analytics';

const guid = '340ba6de-ff51-408c-ab54-9a512acb35ff';

jest.mock('i18next', () => ({
  language: 'fr-FR',
  t: jest.fn(),
}));

describe('initial state', () => {
  it('should have language set', () => {
    expect(initialAnalyticsState[ANALYTICS_CONTENT_LANGUAGE]).toEqual('fr-FR');
  });
});

describe('key login success', () => {
  it('should save sso guid', () => {
    const action = {
      results: {
        thekey_guid: guid,
      },
      type: REQUESTS.KEY_LOGIN.SUCCESS,
    };

    const result = analyticsReducer(undefined, action);

    expect(result[ANALYTICS_SSO_GUID]).toBe(guid);
  });
});

describe('analytics context changed', () => {
  it('should save changes', () => {
    const screen = 'testScreen';
    const action: AnalyticsContextChangedAction = {
      analyticsContext: {
        [ANALYTICS_PREVIOUS_SCREEN_NAME]: screen,
      },
      type: ANALYTICS_CONTEXT_CHANGED,
    };

    const result = analyticsReducer(undefined, action);

    expect(result[ANALYTICS_PREVIOUS_SCREEN_NAME]).toBe(screen);
  });
});

describe('reload app', () => {
  it('should wipe previous screen name', () => {
    const result = analyticsReducer(
      {
        ...initialAnalyticsState,
        [ANALYTICS_PREVIOUS_SCREEN_NAME]: 'some screen',
      },
      { type: RELOAD_APP },
    );

    expect(result).toEqual(initialAnalyticsState);
  });
});

describe('SET_NOTIFICATION_ANALYTICS', () => {
  it('should set previous screen name to push notification name', () => {
    const result = analyticsReducer(initialAnalyticsState, {
      type: SET_NOTIFICATION_ANALYTICS,
      notificationName: 'steps',
    });

    expect(result).toEqual({
      ...initialAnalyticsState,
      [ANALYTICS_PREVIOUS_SCREEN_NAME]: 'steps_pn',
    });
  });
});

describe('logout', () => {
  it('should wipe IDs and update logged in status', () => {
    const action: AnalyticsContextChangedAction = {
      analyticsContext: {
        [ANALYTICS_PREVIOUS_SCREEN_NAME]: 'hello world',
      },
      type: ANALYTICS_CONTEXT_CHANGED,
    };

    const contextChangeResult = analyticsReducer(
      undefined,
      action,
    ) as AnalyticsState;

    const result = analyticsReducer(contextChangeResult, { type: LOGOUT });

    expect(result).toEqual(
      expect.objectContaining({
        [ANALYTICS_SSO_GUID]: '',
        [ANALYTICS_GR_MASTER_PERSON_ID]: '',
        [ANALYTICS_FACEBOOK_ID]: '',
        [ANALYTICS_LOGGED_IN_STATUS]: NOT_LOGGED_IN,
      }),
    );
  });
});
