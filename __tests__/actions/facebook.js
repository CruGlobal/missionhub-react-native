import { mockFnWithParams } from '../../testUtils';
import { REQUESTS } from '../../src/actions/api';
import * as callApi from '../../src/actions/api';
import { ANALYTICS } from '../../src/constants';
import * as analytics from '../../src/actions/analytics';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  facebookLoginAction, facebookLoginWithUsernamePassword,
  refreshMissionHubFacebookAccess,
} from '../../src/actions/facebook';

const mockStore = configureStore([ thunk ]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
const expectedAnalyticsResult = { type: 'fb id changed' };
const facebookId = 48347272923;

const facebookLoginActionResult = { type: 'refreshed fb login' };
const apiResult = (dispatch) => {
  dispatch(facebookLoginActionResult);
  return Promise.resolve();
};

const accessTokenResult = Promise.resolve({ accessToken: fbAccessToken, userID: facebookId });

let store;

global.LOG = jest.fn();

beforeEach(() => {
  store = mockStore({ auth: {} });
  mockFnWithParams(analytics, 'updateAnalyticsContext', expectedAnalyticsResult, { [ANALYTICS.FACEBOOK_ID]: facebookId });
  mockFnWithParams(callApi, 'default', apiResult, REQUESTS.FACEBOOK_LOGIN, {}, { fb_access_token: fbAccessToken });
  mockFnWithParams(AccessToken, 'getCurrentAccessToken', accessTokenResult);
});

describe('facebookLoginWithUsernamePassword', () => {
  it('logs in', async() => {
    mockFnWithParams(LoginManager, 'logInWithReadPermissions', Promise.resolve({isCancelled: false}), [ 'public_profile', 'email' ]);

    await store.dispatch(facebookLoginWithUsernamePassword(false, null, store));

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expect.anything() ]);
  })
});

describe('facebook login', () => {
  it('should log in to Facebook and then update analytics context', async() => {
    await store.dispatch(facebookLoginAction(fbAccessToken, facebookId))

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expectedAnalyticsResult ]);
  });
});

describe('refreshMissionHubFacebookAccess', () => {
  it('should send current FB access token', async() => {
    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expect.anything() ]);
  });
});
