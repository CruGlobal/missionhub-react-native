import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as callApi from '../../src/actions/api';
import * as constants from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import * as analytics from '../../src/actions/analytics';
import * as login from '../../src/actions/login';
import { facebookLoginAction, keyLogin, refreshAuth, updateTimezone, logout, logoutReset } from '../../src/actions/auth';
import { mockFnWithParams } from '../../testUtils';
import MockDate from 'mockdate';
import { ANALYTICS, LOGOUT } from '../../src/constants';

const email = 'Roger';
const password = 'secret';
const mockClientId = 123456;
const ticket = 'nfnvjvkfkfj886';
const data = `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${email}&password=${password}`;
const refreshToken = 'khjdsfkksadjhsladjjldsvajdscandjehrwewrqr';
const mockStore = configureStore([ thunk ]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
let store;

constants.THE_KEY_CLIENT_ID = mockClientId;

const mockImplementation = (implementation) => {
  return jest.fn().mockImplementation((type) => {
    return (dispatch) => {
      return dispatch(() => implementation(type));
    };
  });
};

const onSuccessfulLoginResult = { type: 'onSuccessfulLogin' };

beforeEach(() => {
  store = mockStore({ auth: { refreshToken: refreshToken } });

  mockFnWithParams(login, 'onSuccessfulLogin', onSuccessfulLoginResult);
});

describe('facebook login', () => {
  global.LOG = jest.fn();

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

describe('the key', () => {
  beforeEach(() => {
    callApi.default = mockImplementation((type) => {
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

      return store.dispatch(refreshAuth())
        .then(() => {
          expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_REFRESH_TOKEN, {}, refreshData);
          expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_GET_TICKET, {}, {});
          expect(callApi.default).toHaveBeenCalledWith(REQUESTS.TICKET_LOGIN, {}, { code: ticket });
        });
    });
  });

  describe('key login', () => {
    it('should login to the key, then get a key ticket, then send the key ticket to Missionhub API, then handle successful login', () => {
      return store.dispatch(keyLogin(email, password))
        .then(() => {
          expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_LOGIN, {}, data);
          expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_GET_TICKET, {}, {});
          expect(callApi.default).toHaveBeenCalledWith(REQUESTS.TICKET_LOGIN, {}, { code: ticket });

          expect(store.getActions()).toEqual([ onSuccessfulLoginResult ]);
        });
    });
  });
});

describe('update time zone', () => {
  beforeEach(() => {
    store = mockStore({
      auth: {
        timezone: '',
      },
    });
  });

  MockDate.set('2018-02-06', 300);

  let tzData = {
    data: {
      attributes: {
        timezone: '-5',
      },
    },
  };

  it('should update timezone ', () => {
    store.dispatch(updateTimezone());
    expect(callApi.default).toHaveBeenCalledWith(REQUESTS.UPDATE_TIMEZONE, {}, tzData);
  });
});

describe('logout', () => {
  beforeEach(() => {
    callApi.default = mockImplementation((type) => {
      if (type === REQUESTS.DELETE_PUSH_TOKEN) {
        return Promise.resolve({});
      } else {
        return Promise.resolve({});
      }
    });
  });


  describe('logout action', () => {
    it('should logout but not delete push token', () => {
      store = mockStore({
        notifications: {
          pushDeviceId: '',
        },
      });
      store.dispatch(logout());
      expect(callApi.default).toHaveBeenCalledTimes(0);
    });

    it('should logout and delete push token', () => {
      store = mockStore({
        notifications: {
          pushDeviceId: '123',
        },
      });

      store.dispatch(logout());
      expect(callApi.default).toHaveBeenCalledTimes(1);
    });

    it('should call logout reset', () => {

      store.dispatch(logoutReset());
      expect(store.getActions()[0]).toEqual({ type: LOGOUT });
    });
  });
});
