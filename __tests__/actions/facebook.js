import { mockFnWithParams } from '../../testUtils';
import { REQUESTS } from '../../src/actions/api';
import * as callApi from '../../src/actions/api';
import { ANALYTICS } from '../../src/constants';
import * as analytics from '../../src/actions/analytics';
import { AccessToken } from 'react-native-fbsdk';
import * as login from '../../src/actions/login';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { facebookLoginAction, refreshMissionHubFacebookAccess } from '../../src/actions/facebook';

const mockStore = configureStore([ thunk ]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
const onSuccessfulLoginResult = { type: 'onSuccessfulLogin' };
let store;

global.LOG = jest.fn();

beforeEach(() => {
  store = mockStore({ auth: {} });

  mockFnWithParams(login, 'onSuccessfulLogin', onSuccessfulLoginResult);
});

describe('facebook login', () => {
  const facebookId = 48347272923;

  const expectedApiData = { fb_access_token: fbAccessToken };
  const expectedApiResult = { type: 'fb success' };

  const expectedAnalyticsResult = { 'type': 'fb id changed' };

  beforeEach(() => {
    const mockFn = (dispatch) => {
      dispatch(expectedApiResult);
      return dispatch(() => Promise.resolve());
    };

    mockFnWithParams(callApi, 'default', mockFn, REQUESTS.FACEBOOK_LOGIN, {}, expectedApiData);

    mockFnWithParams(analytics, 'updateAnalyticsContext',expectedAnalyticsResult, { [ANALYTICS.FACEBOOK_ID]: 48347272923 });
  });

  it('should log in to Facebook, update analytics context, and then handle result', () => {
    return store.dispatch(facebookLoginAction(fbAccessToken, facebookId)).then(() => {
      expect(store.getActions()).toEqual([ expectedApiResult, expectedAnalyticsResult, onSuccessfulLoginResult ]);
    });
  });
});

describe('refreshMissionHubFacebookAccess', () => {
  const accessTokenResult = { accessToken: 'fb access token' };
  const apiResult = { type: 'refreshed fb login' };

  it('should send current FB access token', async() => {
    mockFnWithParams(AccessToken, 'getCurrentAccessToken', accessTokenResult);
    mockFnWithParams(callApi, 'default', (dispatch) => dispatch(apiResult), REQUESTS.FACEBOOK_LOGIN, {}, { fb_access_token: accessTokenResult.accessToken });

    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(store.getActions()).toEqual([ apiResult ]);
  });
});
