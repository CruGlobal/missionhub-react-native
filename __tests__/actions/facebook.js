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
const upgradeToken = 'jllkjasdflk32l232';

const facebookLoginActionResult = { type: 'fb login success' };
const apiResult = (dispatch) => {
  dispatch(facebookLoginActionResult);
  return Promise.resolve();
};

const accessTokenResult = Promise.resolve({ accessToken: fbAccessToken, userID: facebookId });

let store;

global.LOG = jest.fn();

beforeEach(() => {
  store = mockStore({ auth: {
    upgradeToken,
  } });
  mockFnWithParams(analytics, 'updateAnalyticsContext', expectedAnalyticsResult, { [ANALYTICS.FACEBOOK_ID]: facebookId });
  mockFnWithParams(callApi, 'default', apiResult, REQUESTS.FACEBOOK_LOGIN, {}, { fb_access_token: fbAccessToken });
  mockFnWithParams(AccessToken, 'getCurrentAccessToken', accessTokenResult);
});

describe('facebookLoginWithUsernamePassword', () => {
  beforeEach(() => mockFnWithParams(LoginManager, 'logInWithReadPermissions', Promise.resolve({ isCancelled: false }), [ 'public_profile', 'email' ]));

  it('logs in', async() => {
    await store.dispatch(facebookLoginWithUsernamePassword(false, null));

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expect.anything() ]);
  });

  it('fires onComplete action if present', async() => {
    const onCompleteResult = { type: 'hello, world' };

    await store.dispatch(facebookLoginWithUsernamePassword(false, () => onCompleteResult));

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expect.anything(), onCompleteResult ]);
  });

  it('upgrades account', async() => {
    const data = {
      fb_access_token: fbAccessToken,
      provider: 'client_token',
      client_token: upgradeToken,
    };
    mockFnWithParams(callApi, 'default', apiResult, REQUESTS.FACEBOOK_LOGIN, {}, data);

    await store.dispatch(facebookLoginWithUsernamePassword(true, null));

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expect.anything() ]);
  });
});

describe('facebook login', () => {
  it('should log in to Facebook and then update analytics context', async() => {
    await store.dispatch(facebookLoginAction(fbAccessToken, facebookId));

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expectedAnalyticsResult ]);
  });
});

describe('refreshMissionHubFacebookAccess', () => {
  it('should send current FB access token', async() => {
    mockFnWithParams(AccessToken, 'refreshCurrentAccessTokenAsync', Promise.resolve());

    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expect.anything() ]);
  });
});
