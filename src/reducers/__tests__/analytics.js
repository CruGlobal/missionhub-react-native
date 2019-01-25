import analyticsReducer from '../analytics';
import {
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  LOGOUT,
  NOT_LOGGED_IN,
} from '../../constants';
import { REQUESTS } from '../../actions/api';

const guid = '340ba6de-ff51-408c-ab54-9a512acb35ff';

jest.mock('i18next', () => ({
  language: 'fr-FR',
  t: jest.fn(),
}));

describe('initial state', () => {
  it('should have language set', () => {
    const result = analyticsReducer(undefined, { type: 'none' });

    expect(result[ANALYTICS.CONTENT_LANGUAGE]).toEqual('fr-FR');
  });
});

describe('key login success', () => {
  it('should save sso guid', () => {
    const state = {};
    const action = {
      results: {
        thekey_guid: guid,
      },
      type: REQUESTS.KEY_LOGIN.SUCCESS,
    };

    const result = analyticsReducer(state, action);

    expect(result[ANALYTICS.SSO_GUID]).toBe(guid);
  });
});

describe('analytics context changed', () => {
  it('should save changes', () => {
    const state = {
      [ANALYTICS.SCREENNAME]: 'testScreen',
    };
    const screen2 = 'testScreen2';
    const action = {
      analyticsContext: {
        [ANALYTICS.SCREENNAME]: screen2,
      },
      type: ANALYTICS_CONTEXT_CHANGED,
    };

    const result = analyticsReducer(state, action);

    expect(result[ANALYTICS.SCREENNAME]).toBe(screen2);
  });
});

describe('logout', () => {
  it('should wipe IDs and update logged in status', () => {
    const state = {
      [ANALYTICS.SCREENNAME]: 'hello world',
    };

    const result = analyticsReducer(state, { type: LOGOUT });

    expect(result).toEqual({
      ...state,
      [ANALYTICS.SSO_GUID]: '',
      [ANALYTICS.GR_MASTER_PERSON_ID]: '',
      [ANALYTICS.FACEBOOK_ID]: '',
      [ANALYTICS.LOGGED_IN_STATUS]: NOT_LOGGED_IN,
    });
  });
});
