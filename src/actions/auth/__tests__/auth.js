import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PushNotification from 'react-native-push-notification';

import { REQUESTS } from '../../../api/routes';
import {
  logout,
  navigateToPostAuthScreen,
  handleInvalidAccessToken,
} from '../auth';
import { refreshAccessToken } from '../key';
import { refreshAnonymousLogin } from '../anonymous';
import { refreshMissionHubFacebookAccess } from '../facebook';
import { deletePushToken } from '../../notifications';

jest.mock('react-native-push-notification');
jest.mock('../../notifications');
jest.mock('../key');
jest.mock('../anonymous');
jest.mock('../facebook');

const mockStore = configureStore([thunk]);

let store;

beforeEach(() => {
  store = mockStore();
});

describe('logout', () => {
  it('should perform the needed actions for signing out', async () => {
    deletePushToken.mockReturnValue({
      type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
    });
    await store.dispatch(logout());
    expect(store.getActions()).toMatchSnapshot();
    expect(PushNotification.unregister).toHaveBeenCalled();
  });
  it('should perform the needed actions for forced signing out', async () => {
    deletePushToken.mockReturnValue({
      type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
    });
    await store.dispatch(logout(true));
    expect(store.getActions()).toMatchSnapshot();
    expect(PushNotification.unregister).toHaveBeenCalled();
  });
  it('should perform the needed actions even after push token deletion failure', async () => {
    deletePushToken.mockReturnValue(() => () => Promise.reject());
    await store.dispatch(logout(true));
    expect(store.getActions()).toMatchSnapshot();
    expect(PushNotification.unregister).toHaveBeenCalled();
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
    expect(store.getActions()).toMatchSnapshot();
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
    expect(store.getActions()).toMatchSnapshot();
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
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('handleInvalidAccessToken', () => {
  it('should refresh key access token if user is logged in with TheKey with expired token', async () => {
    await store.dispatch(handleInvalidAccessToken());

    return test(
      { refreshToken: 'refresh' },
      getMeRequest,
      expiredTokenError,
      refreshAccessToken,
      [],
      { type: 'refreshed token' },
      accessTokenQuery,
      {},
    );
  });
  it('should refresh key access token if user is logged in with TheKey with invalid token', () => {
    return test(
      { refreshToken: 'refresh' },
      getMeRequest,
      invalidTokenError,
      refreshAccessToken,
      [],
      { type: 'refreshed token' },
      accessTokenQuery,
      {},
    );
  });

  it('should refresh anonymous login if user is Try It Now with expired token', () => {
    return test(
      { isFirstTime: true },
      getMeRequest,
      expiredTokenError,
      refreshAnonymousLogin,
      [],
      { type: 'refreshed anonymous token' },
      accessTokenQuery,
      {},
    );
  });
  it('should refresh anonymous login if user is Try It Now with invalid token', () => {
    return test(
      { isFirstTime: true },
      getMeRequest,
      invalidTokenError,
      refreshAnonymousLogin,
      [],
      { type: 'refreshed anonymous token' },
      accessTokenQuery,
      {},
    );
  });

  it('should refresh facebook login if user is not logged in with TheKey or Try It Now with expired token', () => {
    return test(
      {},
      getMeRequest,
      expiredTokenError,
      refreshMissionHubFacebookAccess,
      [],
      { type: 'refreshed fb login' },
      accessTokenQuery,
      {},
    );
  });
  it('should refresh facebook login if user is not logged in with TheKey or Try It Now with invalid token', () => {
    return test(
      {},
      getMeRequest,
      invalidTokenError,
      refreshMissionHubFacebookAccess,
      [],
      { type: 'refreshed fb login' },
      accessTokenQuery,
      {},
    );
  });
});
