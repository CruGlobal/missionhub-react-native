/* eslint max-lines: 0 */

// @ts-ignore
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../../api';
import { REQUESTS } from '../../../api/routes';
import {
  ANALYTICS,
  ANALYTICS_CONTEXT_CHANGED,
  CLEAR_UPGRADE_TOKEN,
  FACEBOOK_CANCELED_ERROR,
} from '../../../constants';
import {
  facebookPromptLogin,
  facebookLoginWithAccessToken,
  refreshMissionHubFacebookAccess,
} from '../facebook';
import { authSuccess } from '../userData';

jest.mock('react-native-fbsdk', () => ({
  LoginManager: { logInWithPermissions: jest.fn(), logOut: jest.fn() },
  AccessToken: {
    getCurrentAccessToken: jest.fn(),
    refreshCurrentAccessTokenAsync: jest.fn(),
  },
}));
jest.mock('../../api');
jest.mock('../userData');

const FACEBOOK_SCOPE = ['public_profile', 'email'];

const mockStore = configureStore([thunk]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
const facebookId = 48347272923;
const upgradeToken = 'jllkjasdflk32l232';

const facebookLoginActionResult = { type: 'fb login success' };
const authSuccessResult = { type: 'authSuccess' };

// @ts-ignore
let store;

beforeEach(() => {
  store = mockStore({
    auth: {},
  });

  // @ts-ignore
  callApi.mockReturnValue(dispatch => dispatch(facebookLoginActionResult));
  // @ts-ignore
  authSuccess.mockReturnValue(authSuccessResult);
});

describe('facebookPromptLogin', () => {
  const FACEBOOK_SCOPE = ['public_profile', 'email'];

  it('should call the Facebook SDK to prompt user to sign in', async () => {
    LoginManager.logInWithPermissions.mockResolvedValue({
      isCancelled: false,
    });

    // @ts-ignore
    await store.dispatch(facebookPromptLogin());

    expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
      FACEBOOK_SCOPE,
    );
  });
  it('should throw an error if user cancels sign in', async () => {
    LoginManager.logInWithPermissions.mockResolvedValue({
      isCancelled: true,
    });

    // @ts-ignore
    await expect(store.dispatch(facebookPromptLogin())).rejects.toThrow(
      FACEBOOK_CANCELED_ERROR,
    );

    expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
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
      // @ts-ignore
      await store.dispatch(
        // @ts-ignore
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

      // @ts-ignore
      expect(store.getActions()).toEqual([
        facebookLoginActionResult,
        { type: CLEAR_UPGRADE_TOKEN },
        {
          analyticsContext: { [ANALYTICS.FACEBOOK_ID]: facebookId },
          type: ANALYTICS_CONTEXT_CHANGED,
        },
        authSuccessResult,
      ]);
    });
    it('with upgradeToken', async () => {
      store = mockStore({
        auth: { upgradeToken },
      });

      await store.dispatch(
        // @ts-ignore
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
        // @ts-ignore
        .mockReturnValueOnce(() => {
          throw {
            apiError: {
              errors: [
                { status: '422', detail: 'client_token already invalidated' },
              ],
            },
          };
        })
        // @ts-ignore
        .mockReturnValueOnce(dispatch => dispatch(facebookLoginActionResult));

      await store.dispatch(
        // @ts-ignore
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
      // @ts-ignore
      store.dispatch(facebookLoginWithAccessToken(fbAccessToken, facebookId)),
    ).rejects.toThrow("Facebook access token doesn't exist");

    expect(AccessToken.getCurrentAccessToken).toHaveBeenCalled();
    expect(callApi).not.toHaveBeenCalled();
    expect(LoginManager.logOut).toHaveBeenCalled();

    // @ts-ignore
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

    // @ts-ignore
    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(AccessToken.refreshCurrentAccessTokenAsync).toHaveBeenCalledWith();
    expect(AccessToken.getCurrentAccessToken).toHaveBeenCalledWith();
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.FACEBOOK_LOGIN,
      {},
      { fb_access_token: fbAccessToken },
    );
    expect(LoginManager.logInWithPermissions).not.toHaveBeenCalled();
    // @ts-ignore
    expect(store.getActions()).toEqual([
      facebookLoginActionResult,
      { type: CLEAR_UPGRADE_TOKEN },
      {
        analyticsContext: { [ANALYTICS.FACEBOOK_ID]: facebookId },
        type: ANALYTICS_CONTEXT_CHANGED,
      },
      authSuccessResult,
    ]);
  });

  it('should prompt user to log in again if an error occurs', async () => {
    AccessToken.refreshCurrentAccessTokenAsync.mockRejectedValue();
    LoginManager.logInWithPermissions.mockResolvedValue({
      isCancelled: false,
    });

    // @ts-ignore
    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(AccessToken.refreshCurrentAccessTokenAsync).toHaveBeenCalledWith();
    expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
      FACEBOOK_SCOPE,
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([
      facebookLoginActionResult,
      { type: CLEAR_UPGRADE_TOKEN },
      {
        analyticsContext: { [ANALYTICS.FACEBOOK_ID]: facebookId },
        type: ANALYTICS_CONTEXT_CHANGED,
      },
      authSuccessResult,
    ]);
  });

  it('should prompt log out if user cancels login prompt', async () => {
    AccessToken.refreshCurrentAccessTokenAsync.mockRejectedValue();
    LoginManager.logInWithPermissions.mockResolvedValue({
      isCancelled: true,
    });
    LoginManager.logOut.mockResolvedValue();

    // @ts-ignore
    await store.dispatch(refreshMissionHubFacebookAccess());

    expect(AccessToken.refreshCurrentAccessTokenAsync).toHaveBeenCalledWith();
    expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
      FACEBOOK_SCOPE,
    );
    expect(LoginManager.logOut).toHaveBeenCalledWith();
    // @ts-ignore
    expect(store.getActions()).toEqual([]);
  });
});
