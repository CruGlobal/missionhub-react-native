/* eslint-disable @typescript-eslint/no-explicit-any */

import configureStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';

import { REQUESTS } from '../../../api/routes';
import { LOGOUT } from '../../../constants';
import { SIGN_IN_FLOW } from '../../../routes/constants';
import { LANDING_SCREEN } from '../../../containers/LandingScreen';
import { logout } from '../auth';
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
    expect(navigateReset).toHaveBeenCalledWith(LANDING_SCREEN);
    expect(PushNotification.unregister).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      deletePushTokenResult,
      navigateResetResult,
      { type: LOGOUT },
    ]);
  });

  it('should perform the needed actions for forced signing out', async () => {
    await store.dispatch<any>(logout(true));

    expect(deletePushToken).toHaveBeenCalledWith();
    expect(navigateReset).toHaveBeenCalledWith(SIGN_IN_FLOW, {
      forcedLogout: true,
    });
    expect(PushNotification.unregister).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      deletePushTokenResult,
      navigateResetResult,
      { type: LOGOUT },
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
    expect(store.getActions()).toEqual([navigateResetResult, { type: LOGOUT }]);
  });
});
