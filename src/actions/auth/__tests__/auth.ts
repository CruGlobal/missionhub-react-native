/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
// @ts-ignore
import PushNotification from 'react-native-push-notification';
// @ts-ignore
import { AccessToken } from 'react-native-fbsdk';

import { REQUESTS } from '../../../api/routes';
import { LOGOUT } from '../../../constants';
import { SIGN_IN_FLOW } from '../../../routes/constants';
import { LANDING_SCREEN } from '../../../containers/LandingScreen';
import { logout, handleInvalidAccessToken } from '../auth';
import { getFeatureFlags } from '../../misc';
import { refreshAccessToken } from '../key';
import { refreshAnonymousLogin } from '../anonymous';
import { refreshMissionHubFacebookAccess } from '../facebook';
import { deletePushToken, checkNotifications } from '../../notifications';
import { navigateReset, navigateToMainTabs } from '../../navigation';
import { startOnboarding } from '../../onboarding';

jest.mock('react-native-fbsdk', () => ({
  AccessToken: { getCurrentAccessToken: jest.fn() },
}));
jest.mock('../../notifications');
jest.mock('../../navigation');
jest.mock('../../onboarding');
jest.mock('../../analytics');
jest.mock('../../misc');
jest.mock('../key');
jest.mock('../anonymous');
jest.mock('../facebook');

const mockStore = configureStore([thunk]);

let store: MockStore;

const deletePushTokenResult = { type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS };
const navigateResetResult = { type: 'navigate reset' };
const startOnboardingResult = { type: 'start onboarding' };
const navigateToMainTabsResult = { type: 'navigate to main tabs' };
const checkNotificationsResult = { type: 'check notifications' };

beforeEach(() => {
  store = mockStore();

  (deletePushToken as jest.Mock).mockReturnValue(deletePushTokenResult);
  (navigateReset as jest.Mock).mockReturnValue(navigateResetResult);
  (startOnboarding as jest.Mock).mockReturnValue(startOnboardingResult);
  (navigateToMainTabs as jest.Mock).mockReturnValue(navigateToMainTabsResult);
  (checkNotifications as jest.Mock).mockReturnValue(checkNotificationsResult);
});

describe('logout', () => {
  it('should perform the needed actions for signing out', async () => {
    await store.dispatch<any>(logout());

    expect(deletePushToken).toHaveBeenCalledWith();
    expect(getFeatureFlags).toHaveBeenCalledWith();
    expect(navigateReset).toHaveBeenCalledWith(LANDING_SCREEN);
    expect(PushNotification.unregister).toHaveBeenCalled();
    // @ts-ignore
    expect(store.getActions()).toEqual([
      deletePushTokenResult,
      { type: LOGOUT },
      navigateResetResult,
    ]);
  });

  it('should perform the needed actions for forced signing out', async () => {
    await store.dispatch<any>(logout(true));

    expect(deletePushToken).toHaveBeenCalledWith();
    expect(getFeatureFlags).toHaveBeenCalledWith();
    expect(navigateReset).toHaveBeenCalledWith(SIGN_IN_FLOW, {
      forcedLogout: true,
    });
    expect(PushNotification.unregister).toHaveBeenCalled();
    // @ts-ignore
    expect(store.getActions()).toEqual([
      deletePushTokenResult,
      { type: LOGOUT },
      navigateResetResult,
    ]);
  });

  it('should perform the needed actions even after push token deletion failure', async () => {
    (deletePushToken as jest.Mock).mockReturnValue(() => () =>
      Promise.reject(),
    );

    await store.dispatch<any>(logout(true));

    expect(deletePushToken).toHaveBeenCalledWith();
    expect(navigateReset).toHaveBeenCalledWith(SIGN_IN_FLOW, {
      forcedLogout: true,
    });
    expect(PushNotification.unregister).toHaveBeenCalled();
    // @ts-ignore
    expect(store.getActions()).toEqual([{ type: LOGOUT }, navigateResetResult]);
  });
});

describe('handleInvalidAccessToken', () => {
  const refreshAccessTokenResult = { type: 'refresh access token' };
  const refreshAnonymousLoginResult = { type: 'refresh anonymous login' };
  const refreshFacebookAccessResult = {
    type: 'refresh Facebook Access',
  };

  beforeEach(() => {
    (refreshAccessToken as jest.Mock).mockReturnValue(refreshAccessTokenResult);
    (refreshAnonymousLogin as jest.Mock).mockReturnValue(
      refreshAnonymousLoginResult,
    );
    (refreshMissionHubFacebookAccess as jest.Mock).mockReturnValue(
      refreshFacebookAccessResult,
    );
  });

  it('should refresh key access token if user is logged in with TheKey', async () => {
    store = mockStore({
      auth: {
        refreshToken: '111',
      },
    });

    await store.dispatch<any>(handleInvalidAccessToken());

    expect(refreshAccessToken).toHaveBeenCalledWith();
  });

  it('should refresh anonymous login if user is Try It Now', async () => {
    store = mockStore({
      auth: {
        upgradeToken: 'some-upgrade-token',
      },
    });

    await store.dispatch<any>(handleInvalidAccessToken());

    expect(refreshAnonymousLogin).toHaveBeenCalledWith();
  });

  it('should refresh facebook login', async () => {
    store = mockStore({ auth: {} });
    (AccessToken.getCurrentAccessToken as jest.Mock).mockReturnValue({
      accessToken: '111',
    });

    await store.dispatch<any>(handleInvalidAccessToken());

    expect(refreshMissionHubFacebookAccess).toHaveBeenCalledWith();
  });

  it('should logout user if none of the above conditions are met', async () => {
    store = mockStore({ auth: {} });
    (AccessToken.getCurrentAccessToken as jest.Mock).mockReturnValue({});

    await store.dispatch<any>(handleInvalidAccessToken());

    expect(deletePushToken).toHaveBeenCalledWith();
    expect(navigateReset).toHaveBeenCalledWith(SIGN_IN_FLOW, {
      forcedLogout: true,
    });
    expect(PushNotification.unregister).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      deletePushTokenResult,
      { type: LOGOUT },
      navigateResetResult,
    ]);
  });
});
