import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';
import { AccessToken } from 'react-native-fbsdk';

import { REQUESTS } from '../../../api/routes';
import { LOGOUT, COMPLETE_ONBOARDING } from '../../../constants';
import {
  SIGN_IN_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
  ADD_SOMEONE_ONBOARDING_FLOW,
} from '../../../routes/constants';
import { LANDING_SCREEN } from '../../../containers/LandingScreen';
import {
  logout,
  navigateToPostAuthScreen,
  handleInvalidAccessToken,
} from '../auth';
import { refreshAccessToken } from '../key';
import { refreshAnonymousLogin } from '../anonymous';
import { refreshMissionHubFacebookAccess } from '../facebook';
import { deletePushToken } from '../../notifications';
import { navigateReset, navigateToMainTabs } from '../../navigation';
import { completeOnboarding } from '../../onboardingProfile';

jest.mock('react-native-fbsdk', () => ({
  AccessToken: { getCurrentAccessToken: jest.fn() },
}));
jest.mock('react-native-push-notification');
jest.mock('../../notifications');
jest.mock('../../navigation');
jest.mock('../../onboardingProfile');
jest.mock('../key');
jest.mock('../anonymous');
jest.mock('../facebook');

const mockStore = configureStore([thunk]);

let store;

const deletePushTokenResult = { type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS };
const navigateResetResult = { type: 'navigate reset' };
const navigateToMainTabsResult = { type: 'navigate to main tabs' };
const completeOnboardingResult = { type: COMPLETE_ONBOARDING };

beforeEach(() => {
  store = mockStore();

  deletePushToken.mockReturnValue(deletePushTokenResult);
  navigateReset.mockReturnValue(navigateResetResult);
  navigateToMainTabs.mockReturnValue(navigateToMainTabsResult);
  completeOnboarding.mockReturnValue(completeOnboardingResult);
});

describe('logout', () => {
  it('should perform the needed actions for signing out', async () => {
    await store.dispatch(logout());

    expect(deletePushToken).toHaveBeenCalledWith();
    expect(navigateReset).toHaveBeenCalledWith(LANDING_SCREEN);
    expect(PushNotification.unregister).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      deletePushTokenResult,
      { type: LOGOUT },
      navigateResetResult,
    ]);
  });

  it('should perform the needed actions for forced signing out', async () => {
    await store.dispatch(logout(true));

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

  it('should perform the needed actions even after push token deletion failure', async () => {
    deletePushToken.mockReturnValue(() => () => Promise.reject());

    await store.dispatch(logout(true));

    expect(deletePushToken).toHaveBeenCalledWith();
    expect(navigateReset).toHaveBeenCalledWith(SIGN_IN_FLOW, {
      forcedLogout: true,
    });
    expect(PushNotification.unregister).toHaveBeenCalled();
    expect(store.getActions()).toEqual([{ type: LOGOUT }, navigateResetResult]);
  });
});

describe('navigateToPostAuthScreen', () => {
  it("should navigate to get started if user's pathway_stage_id is missing", () => {
    store = mockStore({
      auth: {
        person: {
          user: {},
        },
      },
    });

    store.dispatch(navigateToPostAuthScreen());

    expect(navigateReset).toHaveBeenCalledWith(GET_STARTED_ONBOARDING_FLOW);
    expect(store.getActions()).toEqual([navigateResetResult]);
  });

  it('should navigate to main tabs if user has pathway_stage_id and contact assignments', () => {
    store = mockStore({
      auth: {
        person: {
          contact_assignments: [{ pathway_stage_id: '1' }],
          user: {
            pathway_stage_id: '1',
          },
        },
      },
    });

    store.dispatch(navigateToPostAuthScreen());

    expect(navigateToMainTabs).toHaveBeenCalledWith();
    expect(completeOnboarding).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      navigateToMainTabsResult,
      completeOnboardingResult,
    ]);
  });

  it('should navigate to add someone if user has pathway_stage_id and no contact assignments', () => {
    store = mockStore({
      auth: {
        person: {
          contact_assignments: [],
          user: {
            pathway_stage_id: '1',
          },
        },
      },
    });

    store.dispatch(navigateToPostAuthScreen());

    expect(navigateReset).toHaveBeenCalledWith(ADD_SOMEONE_ONBOARDING_FLOW);
    expect(store.getActions()).toEqual([navigateResetResult]);
  });
});

describe('handleInvalidAccessToken', () => {
  const refreshAccessTokenResult = { type: 'refresh access token' };
  const refreshAnonymousLoginResult = { type: 'refresh anonymous login' };
  const refreshFacebookAccessResult = {
    type: 'refresh Facebook Access',
  };

  beforeEach(() => {
    refreshAccessToken.mockReturnValue(refreshAccessTokenResult);
    refreshAnonymousLogin.mockReturnValue(refreshAnonymousLoginResult);
    refreshMissionHubFacebookAccess.mockReturnValue(
      refreshFacebookAccessResult,
    );
  });

  it('should refresh key access token if user is logged in with TheKey', async () => {
    store = mockStore({
      auth: {
        refreshToken: '111',
      },
    });

    await store.dispatch(handleInvalidAccessToken());

    expect(refreshAccessToken).toHaveBeenCalledWith();
  });

  it('should refresh anonymous login if user is Try It Now', async () => {
    store = mockStore({
      auth: {
        isFirstTime: true,
      },
    });

    await store.dispatch(handleInvalidAccessToken());

    expect(refreshAnonymousLogin).toHaveBeenCalledWith();
  });

  it('should refresh facebook login', async () => {
    store = mockStore({ auth: {} });
    AccessToken.getCurrentAccessToken.mockReturnValue({ accessToken: '111' });

    await store.dispatch(handleInvalidAccessToken());

    expect(refreshMissionHubFacebookAccess).toHaveBeenCalledWith();
  });

  it('should logout user if none of the above conditions are met', async () => {
    store = mockStore({ auth: {} });
    AccessToken.getCurrentAccessToken.mockReturnValue({});

    await store.dispatch(handleInvalidAccessToken());

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
