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

let store;

global.LOG = jest.fn();

beforeEach(() => {
  store = mockStore({ auth: {} });
  mockFnWithParams(analytics, 'updateAnalyticsContext', expectedAnalyticsResult, { [ANALYTICS.FACEBOOK_ID]: facebookId });
});

describe('facebook login', () => {
  const expectedApiData = { fb_access_token: fbAccessToken };
  const expectedApiResult = { type: 'fb success' };

  beforeEach(() => {
    const mockFn = (dispatch) => {
      dispatch(expectedApiResult);
      return dispatch(() => Promise.resolve());
    };

    mockFnWithParams(callApi, 'default', mockFn, REQUESTS.FACEBOOK_LOGIN, {}, expectedApiData);
  });

  it('should log in to Facebook, update analytics context, and then handle result', () => {
    return store.dispatch(facebookLoginAction(fbAccessToken, facebookId)).then(() => {
      expect(store.getActions()).toEqual([ expectedApiResult, expectedAnalyticsResult ]);
    });
  });
});

describe('refreshMissionHubFacebookAccess', () => {
  const accessTokenResult = { accessToken: 'fb access token', userID: facebookId };
  const facebookLoginAction = { type: 'refreshed fb login' };
  const apiResult = (dispatch) => {
    dispatch(facebookLoginAction);
    return Promise.resolve();
  };

  it('should send current FB access token', async() => {
    mockFnWithParams(AccessToken, 'getCurrentAccessToken', accessTokenResult);
    mockFnWithParams(callApi, 'default', apiResult, REQUESTS.FACEBOOK_LOGIN, {}, { fb_access_token: accessTokenResult.accessToken });

    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(store.getActions()).toEqual([ facebookLoginAction, expect.anything() ]);
  });
});
