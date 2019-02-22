/* eslint max-lines: 0, max-lines-per-function: 0 */

import { AccessToken, LoginManager } from 'react-native-fbsdk';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi, { REQUESTS } from '../../api';
import {
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  CLEAR_UPGRADE_TOKEN,
} from '../../../constants';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
  refreshMissionHubFacebookAccess,
} from '../facebook';
import { authSuccess } from '../userData';

jest.mock('react-native-fbsdk', () => ({
  LoginManager: { logInWithReadPermissions: jest.fn(), logOut: jest.fn() },
  AccessToken: {
    getCurrentAccessToken: jest.fn(),
    refreshCurrentAccessTokenAsync: jest.fn(),
  },
}));
jest.mock('../../api');
jest.mock('../../auth/userData');
authSuccess.mockReturnValue({ type: 'authSuccess' });

const mockStore = configureStore([thunk]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
const facebookId = 48347272923;
const upgradeToken = 'jllkjasdflk32l232';

const facebookLoginActionResult = { type: 'fb login success' };

let store;

beforeEach(() => {
  store = mockStore({
    auth: {},
  });
});

describe('facebookPromptLogin', () => {
  const FACEBOOK_SCOPE = ['public_profile', 'email'];

  it('should call the Facebook SDK to prompt user to sign in', async () => {
    LoginManager.logInWithReadPermissions.mockResolvedValue({
      isCancelled: false,
    });

    await store.dispatch(facebookPromptLogin());

    expect(LoginManager.logInWithReadPermissions).toHaveBeenCalledWith(
      FACEBOOK_SCOPE,
    );
  });
  it('should throw an error if user cancels sign in', async () => {
    LoginManager.logInWithReadPermissions.mockResolvedValue({
      isCancelled: true,
    });

    await expect(store.dispatch(facebookPromptLogin())).rejects.toThrow(
      'Facebook login canceled by user',
    );

    expect(LoginManager.logInWithReadPermissions).toHaveBeenCalledWith(
      FACEBOOK_SCOPE,
    );
  });
});

describe('facebookLoginWithAccessToken', () => {
  describe('should log in to Facebook and then update analytics and person tracking', () => {
    beforeEach(() => {
      AccessToken.getCurrentAccessToken.mockResolvedValue({
        accessToken: fbAccessToken,
        userID: facebookId,
      });
    });

    it('without upgradeToken', async () => {
      store = mockStore({
        auth: {},
      });

      callApi.mockReturnValue(dispatch => dispatch(facebookLoginActionResult));

      await store.dispatch(
        facebookLoginWithAccessToken(fbAccessToken, facebookId),
      );

      expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled();
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.FACEBOOK_LOGIN,
        {},
        {
          fb_access_token: fbAccessToken,
        },
      );
      expect(LoginManager.logOut).not.toHaveBeenCalled();

      expect(store.getActions()).toEqual([
        facebookLoginActionResult,
        { type: CLEAR_UPGRADE_TOKEN },
        {
          analyticsContext: { [ANALYTICS.FACEBOOK_ID]: facebookId },
          type: ANALYTICS_CONTEXT_CHANGED,
        },
        { type: 'authSuccess' },
      ]);
    });
    it('with upgradeToken', async () => {
      store = mockStore({
        auth: { upgradeToken },
      });

      callApi.mockReturnValue(dispatch => dispatch(facebookLoginActionResult));

      await store.dispatch(
        facebookLoginWithAccessToken(fbAccessToken, facebookId),
      );

      expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled();
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.FACEBOOK_LOGIN,
        {},
        {
          fb_access_token: fbAccessToken,
          client_token: upgradeToken,
        },
      );
      expect(LoginManager.logOut).not.toHaveBeenCalled();

      expect(store.getActions()).toEqual([
        facebookLoginActionResult,
        { type: CLEAR_UPGRADE_TOKEN },
        {
          analyticsContext: { [ANALYTICS.FACEBOOK_ID]: facebookId },
          type: ANALYTICS_CONTEXT_CHANGED,
        },
        { type: 'authSuccess' },
      ]);
    });
    it('with invalidated upgradeToken', async () => {
      store = mockStore({
        auth: { upgradeToken },
      });

      callApi
        .mockReturnValueOnce(() => {
          throw {
            apiError: {
              errors: [
                { status: '422', detail: 'client_token already invalidated' },
              ],
            },
          };
        })
        .mockReturnValueOnce(dispatch => dispatch(facebookLoginActionResult));

      await store.dispatch(
        facebookLoginWithAccessToken(fbAccessToken, facebookId),
      );

      expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled();
      expect(callApi).toHaveBeenNthCalledWith(
        1,
        REQUESTS.FACEBOOK_LOGIN,
        {},
        {
          fb_access_token: fbAccessToken,
          client_token: upgradeToken,
        },
      );
      expect(callApi).toHaveBeenNthCalledWith(
        2,
        REQUESTS.FACEBOOK_LOGIN,
        {},
        {
          fb_access_token: fbAccessToken,
        },
      );
      expect(LoginManager.logOut).not.toHaveBeenCalled();

      expect(store.getActions()).toEqual([
        facebookLoginActionResult,
        { type: CLEAR_UPGRADE_TOKEN },
        {
          analyticsContext: { [ANALYTICS.FACEBOOK_ID]: facebookId },
          type: ANALYTICS_CONTEXT_CHANGED,
        },
        { type: 'authSuccess' },
      ]);
    });
  });
  it("should throw an error if the Facebook SDK doesn't return an access token", async () => {
    AccessToken.getCurrentAccessToken.mockResolvedValue(null);

    await expect(
      store.dispatch(facebookLoginWithAccessToken(fbAccessToken, facebookId)),
    ).rejects.toThrow("Facebook access token doesn't exist");

    expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled();
    expect(callApi).not.toHaveBeenCalled();
    expect(LoginManager.logOut).toHaveBeenCalled();

    expect(store.getActions()).toEqual([]);
  });
});

describe('refreshMissionHubFacebookAccess', () => {
  it('should send current FB access token', async () => {
    AccessToken.refreshCurrentAccessTokenAsync.mockResolvedValue();
    AccessToken.getCurrentAccessToken.mockResolvedValue({
      accessToken: fbAccessToken,
      userID: facebookId,
    });

    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(store.getActions()).toEqual([
      facebookLoginActionResult,
      { type: CLEAR_UPGRADE_TOKEN },
      {
        analyticsContext: { [ANALYTICS.FACEBOOK_ID]: facebookId },
        type: ANALYTICS_CONTEXT_CHANGED,
      },
      { type: 'authSuccess' },
    ]);
    expect(LoginManager.logInWithReadPermissions).not.toHaveBeenCalled();
  });

  it('should prompt user to log in again if an error occurs', async () => {
    AccessToken.refreshCurrentAccessTokenAsync.mockRejectedValue();
    LoginManager.logInWithReadPermissions.mockResolvedValue({
      isCancelled: false,
    });

    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(LoginManager.logInWithReadPermissions).toHaveBeenCalled();
  });
});
