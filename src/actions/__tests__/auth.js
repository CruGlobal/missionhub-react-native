import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';
import MockDate from 'mockdate';
import { Linking } from 'react-native';

import * as callApi from '../api';
import { REQUESTS } from '../api';
import * as constants from '../../constants';
import * as navigation from '../navigation';
import * as login from '../login';
import * as auth from '../auth';
import * as person from '../person';
import * as organizations from '../organizations';
import * as stages from '../stages';
import * as steps from '../steps';
import * as notifications from '../notifications';
import {
  keyLogin,
  refreshAccessToken,
  updateLocaleAndTimezone,
  codeLogin,
  logout,
  upgradeAccount,
  upgradeAccountSignIn,
  openKeyURL,
} from '../auth';
import { mockFnWithParams } from '../../../testUtils';
import { UPGRADE_ACCOUNT_SCREEN } from '../../containers/UpgradeAccountScreen';
import { OPEN_URL } from '../../constants';
import { getTimezoneString } from '../auth';
import { refreshAnonymousLogin } from '../auth';
import { deletePushToken } from '../notifications';
import * as onboardingProfile from '../onboardingProfile';
import { KEY_LOGIN_SCREEN } from '../../containers/KeyLoginScreen';

jest.mock('../../actions/notifications');

const email = 'klas&jflk@lkjasdf.com';
const password = 'this&is=unsafe';
const mockClientId = 123456;
const ticket = 'nfnvjvkfkfj886';
const data =
  `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended` +
  `&username=${encodeURIComponent(email)}&password=${encodeURIComponent(
    password,
  )}`;
const refreshToken = 'khjdsfkksadjhsladjjldsvajdscandjehrwewrqr';
const upgradeToken = '2d2123bd-8142-42e7-98e4-81a0dd7a87a6';
const mockStore = configureStore([thunk]);

let store;

constants.THE_KEY_CLIENT_ID = mockClientId;

const mockImplementation = implementation => {
  return jest.fn().mockImplementation(type => {
    return dispatch => {
      return dispatch(() => implementation(type));
    };
  });
};

const onSuccessfulLoginResult = { type: 'onSuccessfulLogin' };
const destinationAfterUpgrade = 'screen after upgrade';

beforeEach(() => {
  store = mockStore({
    auth: {
      token: 'testtoken',
      refreshToken,
      upgradeToken,
      person: {
        user: {},
      },
    },
  });

  mockFnWithParams(
    login,
    'onSuccessfulLogin',
    onSuccessfulLoginResult,
    destinationAfterUpgrade,
  );
});

describe('the key', () => {
  beforeEach(() => {
    callApi.default = mockImplementation(type => {
      if (type === REQUESTS.KEY_GET_TICKET) {
        return Promise.resolve({ ticket: ticket });
      } else {
        return Promise.resolve({});
      }
    });
  });

  describe('key refresh token', () => {
    it('should login to the key, then get a key ticket, then send the key ticket to Missionhub API, then handle successful login', () => {
      const refreshData = `grant_type=refresh_token&refresh_token=${refreshToken}`;

      return store.dispatch(refreshAccessToken()).then(() => {
        expect(callApi.default).toHaveBeenCalledWith(
          REQUESTS.KEY_REFRESH_TOKEN,
          {},
          refreshData,
        );
        expect(callApi.default).toHaveBeenCalledWith(
          REQUESTS.KEY_GET_TICKET,
          {},
          {},
        );
        expect(callApi.default).toHaveBeenCalledWith(
          REQUESTS.TICKET_LOGIN,
          {},
          { code: ticket },
        );
      });
    });
  });

  describe('key login', () => {
    it('should login to the key, then get a key ticket, then send the key ticket to Missionhub API, then handle successful login', () => {
      return store
        .dispatch(
          keyLogin(email, password, null, null, destinationAfterUpgrade),
        )
        .then(() => {
          expect(callApi.default).toHaveBeenCalledWith(
            REQUESTS.KEY_LOGIN,
            {},
            data,
          );
          expect(callApi.default).toHaveBeenCalledWith(
            REQUESTS.KEY_GET_TICKET,
            {},
            {},
          );
          expect(callApi.default).toHaveBeenCalledWith(
            REQUESTS.TICKET_LOGIN,
            {},
            { code: ticket },
          );

          expect(store.getActions()).toEqual([onSuccessfulLoginResult]);
        });
    });

    it('should login to the key, get a key ticket, then send the key ticket to Missionhub API with client token, then handle successful login', () => {
      return store
        .dispatch(
          keyLogin(email, password, null, true, destinationAfterUpgrade),
        )
        .then(() => {
          expect(callApi.default).toHaveBeenCalledWith(
            REQUESTS.KEY_LOGIN,
            {},
            data,
          );
          expect(callApi.default).toHaveBeenCalledWith(
            REQUESTS.KEY_GET_TICKET,
            {},
            {},
          );
          expect(callApi.default).toHaveBeenCalledWith(
            REQUESTS.TICKET_LOGIN,
            {},
            { code: ticket, client_token: upgradeToken },
          );

          expect(store.getActions()).toEqual([onSuccessfulLoginResult]);
        });
    });

    it('should send mfa code if passed', () => {
      const mfaCode = '123456';

      return store
        .dispatch(
          keyLogin(email, password, mfaCode, null, destinationAfterUpgrade),
        )
        .then(() => {
          expect(callApi.default).toHaveBeenCalledWith(
            REQUESTS.KEY_LOGIN,
            {},
            `${data}&thekey_mfa_token=${mfaCode}`,
          );

          expect(store.getActions()).toEqual([onSuccessfulLoginResult]);
        });
    });
  });

  describe('open key URL', () => {
    const expectedUrlResult = { type: OPEN_URL };

    it('should open key URL', () => {
      Linking.addEventListener = jest.fn((_, onComplete) => {
        onComplete({ url: 'testcode=result' });
      });
      Linking.removeEventListener = jest.fn();
      Linking.openURL = jest.fn();
      const onReturn = jest.fn();

      store.dispatch(openKeyURL('login?action=signup', onReturn, false));

      expect(Linking.addEventListener).toHaveBeenCalledWith(
        'url',
        expect.any(Function),
      );
      expect(Linking.removeEventListener).toHaveBeenCalledWith(
        'url',
        expect.any(Function),
      );
      expect(onReturn).toHaveBeenCalledTimes(1);
      expect(store.getActions()).toEqual([expectedUrlResult]);
      expect(Linking.openURL).toHaveBeenCalledWith(expect.any(String));
    });
  });
});

describe('code login', () => {
  beforeEach(() => {
    login.onSuccessfulLogin = jest.fn();
    auth.firstTime = jest.fn();
  });

  it('should run the code login and then on success', () => {
    store.dispatch(codeLogin('123')).then(() => {
      expect(login.onSuccessfulLogin).toHaveBeenCalledTimes(1);
    });
  });

  it('should run the code login and then first time', () => {
    store.dispatch(codeLogin('123')).then(() => {
      expect(auth.firstTime).toHaveBeenCalledTimes(1);
    });
  });
});

describe('updateLocaleAndTimezone', () => {
  beforeEach(() => {
    store = mockStore({
      auth: {
        person: {
          user: {
            timezone: '-8',
            language: 'fr-CA',
          },
        },
      },
    });
  });

  MockDate.set('2018-02-06', 300);
  i18next.language = 'en-US';

  const newUserSettings = {
    data: {
      attributes: {
        timezone: '-5',
        mobile_language: 'en-US',
      },
    },
  };

  it('should update timezone ', () => {
    store.dispatch(updateLocaleAndTimezone());
    expect(callApi.default).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ME_USER,
      {},
      newUserSettings,
    );
  });
});

describe('refreshAnonymousLogin', () => {
  const apiResult = { type: 'refreshed anonymous token' };

  it('should send the code', async () => {
    mockFnWithParams(
      callApi,
      'default',
      dispatch => dispatch(apiResult),
      REQUESTS.REFRESH_ANONYMOUS_LOGIN,
      {},
      { code: upgradeToken },
    );

    await store.dispatch(refreshAnonymousLogin());

    expect(store.getActions()).toEqual([apiResult]);
  });
});

describe('logout', () => {
  it('should perform the needed actions for signing out', async () => {
    deletePushToken.mockReturnValue({
      type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
    });
    await store.dispatch(logout());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('should perform the needed actions for forced signing out', async () => {
    deletePushToken.mockReturnValue({
      type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
    });
    await store.dispatch(logout(true));
    expect(store.getActions()).toMatchSnapshot();
  });
});

describe('on upgrade account', () => {
  beforeEach(() => {
    navigation.navigatePush = jest.fn(screen => ({ type: screen }));
  });

  it('should navigate to login options page', async () => {
    const signupType = 'sign up';

    await store.dispatch(upgradeAccount(signupType));

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      UPGRADE_ACCOUNT_SCREEN,
      {
        signupType,
      },
    );
    expect(store.getActions()).toEqual([{ type: UPGRADE_ACCOUNT_SCREEN }]);
  });

  it('should navigate to key login page', async () => {
    await store.dispatch(upgradeAccountSignIn());

    expect(store.getActions()).toEqual([{ type: KEY_LOGIN_SCREEN }]);
  });
});

describe('loadHome', () => {
  const getMeResult = { type: 'got me successfully' };
  const getStepsResult = { type: 'got steps successfully' };
  const getMyCommunitiesResult = { type: 'got communities' };
  const getStagesResult = { type: 'got stages' };
  const updateUserResult = { type: 'updated locale and TZ' };
  const notificationsResult = { type: 'show notification reminder' };
  const resetOnboardingPersonResult = { type: 'onboarding data cleared' };

  const userSettings = {
    data: {
      attributes: {
        timezone: getTimezoneString(),
        mobile_language: 'en-US',
      },
    },
  };

  it('loads me, organizations, stages, timezone, and notifications', async () => {
    mockFnWithParams(person, 'getMe', getMeResult);
    mockFnWithParams(steps, 'getMySteps', getStepsResult);
    mockFnWithParams(organizations, 'getMyCommunities', getMyCommunitiesResult);
    mockFnWithParams(stages, 'getStagesIfNotExists', getStagesResult);
    mockFnWithParams(
      callApi,
      'default',
      updateUserResult,
      REQUESTS.UPDATE_ME_USER,
      {},
      userSettings,
    );
    mockFnWithParams(notifications, 'showReminderOnLoad', notificationsResult);
    mockFnWithParams(
      onboardingProfile,
      'resetPerson',
      resetOnboardingPersonResult,
    );

    await store.dispatch(auth.loadHome());

    expect(store.getActions()).toEqual([
      getMeResult,
      getMyCommunitiesResult,
      getStagesResult,
      updateUserResult,
      resetOnboardingPersonResult,
      getStepsResult,
      notificationsResult,
    ]);
  });

  it('loads nothing because there is no token', async () => {
    store = mockStore({
      auth: {
        token: '',
        refreshToken,
        upgradeToken,
        person: {
          user: {},
        },
      },
    });
    await store.dispatch(auth.loadHome());

    expect(store.getActions()).toEqual([]);
  });
});
