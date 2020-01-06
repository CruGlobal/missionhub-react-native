import analyticsReducer, { initialAnalyticsState } from '../analytics';
import {
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  LOGOUT,
  NOT_LOGGED_IN,
  RELOAD_APP,
} from '../../constants';
import { REQUESTS } from '../../api/routes';

const guid = '340ba6de-ff51-408c-ab54-9a512acb35ff';

jest.mock('i18next', () => ({
  language: 'fr-FR',
  t: jest.fn(),
}));

describe('initial state', () => {
  it('should have language set', () => {
    expect(initialAnalyticsState[ANALYTICS.CONTENT_LANGUAGE]).toEqual('fr-FR');
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

    expect(result[ANALYTICS.SSO_GUID]).toBe(guid);
  });
});

describe('analytics context changed', () => {
  it('should save changes', () => {
    const screen = 'testScreen';
    const action = {
      analyticsContext: {
        [ANALYTICS.SCREEN_NAME]: screen,
      },
      type: ANALYTICS_CONTEXT_CHANGED as typeof ANALYTICS_CONTEXT_CHANGED,
    };

    const result = analyticsReducer(undefined, action);

    expect(result[ANALYTICS.SCREEN_NAME]).toBe(screen);
  });
});

describe('reload app', () => {
  it('should wipe previous screen name', () => {
    const result = analyticsReducer(
      {
        ...initialAnalyticsState,
        [ANALYTICS.PREVIOUS_SCREEN_NAME]: 'some screen',
      },
      { type: RELOAD_APP },
    );

    expect(result).toEqual(initialAnalyticsState);
  });
});

describe('logout', () => {
  it('should wipe IDs and update logged in status', () => {
    const action = {
      analyticsContext: {
        [ANALYTICS.SCREEN_NAME]: 'hello world',
      },
      type: ANALYTICS_CONTEXT_CHANGED as typeof ANALYTICS_CONTEXT_CHANGED,
    };

    const contextChangeResult = analyticsReducer(undefined, action);

    const result = analyticsReducer(contextChangeResult, { type: LOGOUT });

    expect(result).toEqual(
      expect.objectContaining({
        [ANALYTICS.SSO_GUID]: '',
        [ANALYTICS.GR_MASTER_PERSON_ID]: '',
        [ANALYTICS.FACEBOOK_ID]: '',
        [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
      }),
    );
  });
});
