import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as callApi from '../../src/actions/api';
import * as constants from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import * as analytics from '../../src/actions/analytics';
import * as login from '../../src/actions/login';
import { ANALYTICS_CONTEXT_CHANGED } from '../../src/constants';
import { facebookLoginAction, keyLogin, updateTimezone } from '../../src/actions/auth';
import { mockFnWithParams } from '../../testUtils';

const email = 'Roger';
const password = 'secret';
const mockClientId = 123456;
const ticket = 'nfnvjvkfkfj886';
const data = `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${email}&password=${password}`;
const mockStore = configureStore([ thunk ]);

const fbAccessToken = 'nlnfasljfnasvgywenashfkjasdf';
let store;

constants.THE_KEY_CLIENT_ID = mockClientId;
//
// const getMe = jest.fn();
// const getStages = jest.fn();
// const updateTimezone = jest.fn();
// const setupPushNotifications = jest.fn();
//
// jest.mock('../../src/actions/notifications', () => ({
//   setupPushNotifications: jest.fn(),
// }));
// jest.mock('../../src/actions/people', () => ({
//   getMe: jest.fn(),
// }));
// jest.mock('../../src/actions/stages', () => ({
//   getStages: jest.fn(),
// }));

const mockImplementation = (implementation) => {
  return jest.fn().mockImplementation((type) => {
    return (dispatch) => {
      return dispatch(() => implementation(type));
    };
  });
};

const onSuccessfulLoginResult = { type: 'onSuccessfulLogin' };

beforeEach(() => {
  store = mockStore({});

  mockFnWithParams(login, 'onSuccessfulLogin', onSuccessfulLoginResult);
});

describe('facebook login', () => {
  global.LOG = jest.fn();

  const expectedData = { fb_access_token: fbAccessToken };
  const expectedType = 'fb success' ;

  beforeEach(() => {
    const mockFn = (dispatch) => {
      dispatch({ type: expectedType });
      return dispatch(() => Promise.resolve());
    };

    mockFnWithParams(callApi, 'default', mockFn, REQUESTS.FACEBOOK_LOGIN, {}, expectedData);
  });

  it('should log in to Facebook', () => {
    return store.dispatch(facebookLoginAction(fbAccessToken)).then(() => {
      expect(store.getActions()[0].type).toBe(expectedType);
      expect(store.getActions()[1]).toBe(onSuccessfulLoginResult);
    });
  });
});

describe('key login', () => {
  const loggedInAction = { type: ANALYTICS_CONTEXT_CHANGED, loggedInStatus: true };

  beforeEach(() => {
    callApi.default = mockImplementation((type) => {
      if (type === REQUESTS.KEY_GET_TICKET) {
        return Promise.resolve({ ticket: ticket });
      } else {
        return Promise.resolve({});
      }
    });

    mockFnWithParams(analytics, 'updateLoggedInStatus', loggedInAction, true);
  });


  it('should login to the key, then get a key ticket, then send the key ticket to Missionhub API, then update logged-in status', () => {
    return store.dispatch(keyLogin(email, password))
      .then(() => {
        expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_LOGIN, {}, data);
        expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_GET_TICKET, {}, {});
        expect(callApi.default).toHaveBeenCalledWith(REQUESTS.TICKET_LOGIN, {}, { code: ticket });

        expect(store.getActions()[0]).toBe(loggedInAction);
        expect(store.getActions()[1]).toBe(onSuccessfulLoginResult);
      });
  });
});

// describe('start up action', () => {
//
//
//   beforeEach(() => {
//     store = configureStore([ thunk ])();
//   });
//
//   it('should setup push notifications, get me, get stages, and update the timezone ', () => {
//
//
//     store.dispatch(loadHome());
//
//     expect(setupPushNotifications).toHaveBeenCalledTimes(1);
//     expect(getMe).toHaveBeenCalledTimes(1);
//     expect(updateTimezone).toHaveBeenCalledTimes(1);
//     expect(getStages).toHaveBeenCalledTimes(1);
//   });
// });

describe('update time zone', () => {


  beforeEach(() => {
    store = configureStore([ thunk ])({
      auth: {
        timezone: '',
      },
    });
  });

  let tzData = {
    data: {
      attributes: {
        timezone: '-5',
      },
    },
  };

  it('should update timezone ', () => {
    store.dispatch(updateTimezone());
    console.log(store.getActions());
    expect(callApi.default).toHaveBeenCalledWith(REQUESTS.UPDATE_TIMEZONE, {}, tzData);
  });
});
