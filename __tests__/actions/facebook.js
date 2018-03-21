import { mockFnWithParams } from '../../testUtils';
import { REQUESTS } from '../../src/actions/api';
import * as callApi from '../../src/actions/api';
import { ANALYTICS } from '../../src/constants';
import * as analytics from '../../src/actions/analytics';
import { AccessToken } from 'react-native-fbsdk';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { facebookLoginAction, refreshMissionHubFacebookAccess } from '../../src/actions/facebook';

const mockStore = configureStore([ thunk ]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
const expectedAnalyticsResult = { 'type': 'fb id changed' };
const facebookId = 48347272923;

const facebookLoginActionResult = { type: 'refreshed fb login' };
const apiResult = (dispatch) => {
  dispatch(facebookLoginActionResult);
  return Promise.resolve();
};

let store;

global.LOG = jest.fn();

beforeEach(() => {
  store = mockStore({ auth: {} });
  mockFnWithParams(analytics, 'updateAnalyticsContext', expectedAnalyticsResult, { [ANALYTICS.FACEBOOK_ID]: facebookId });
  mockFnWithParams(callApi, 'default', apiResult, REQUESTS.FACEBOOK_LOGIN, {}, { fb_access_token: fbAccessToken });
});

describe('facebook login', () => {
  it('should log in to Facebook and then update analytics context', () => {
    return store.dispatch(facebookLoginAction(fbAccessToken, facebookId)).then(() => {
      expect(store.getActions()).toEqual([ facebookLoginActionResult, expectedAnalyticsResult ]);
    });
  });
});

describe('refreshMissionHubFacebookAccess', () => {
  const accessTokenResult = { accessToken: fbAccessToken, userID: facebookId };

  it('should send current FB access token', async() => {
    mockFnWithParams(AccessToken, 'getCurrentAccessToken', accessTokenResult);

    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(store.getActions()).toEqual([ facebookLoginActionResult, expect.anything() ]);
  });
});
