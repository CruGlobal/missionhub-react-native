import callApi, { REQUESTS } from '../../src/actions/api';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import API_CALLS from '../../src/api';
import { EXPIRED_ACCESS_TOKEN } from '../../src/constants';
import { mockFnWithParams } from '../../testUtils';
import * as auth from '../../src/actions/auth';

const token = 'alsnjfjwqfpuqfeownposfnjnsaobjfaslkklnsfd';
const mockStore = configureStore([ thunk ]);
let store;
const mockAuthState = {
  token,
};

const query = { access_token: token };
const request = REQUESTS.GET_ME;

const error = {
  errors: [ { detail: EXPIRED_ACCESS_TOKEN } ],
};

global.APILOG = jest.fn();

beforeEach(() => expect.assertions(1));

async function test(state, method, apiResult, ) {
  store = mockStore({ auth: { ...mockAuthState, ...state } });
  mockFnWithParams(API_CALLS, request.name, Promise.reject(error), query, {});
  mockFnWithParams(auth, method, apiResult);

  try {
    await store.dispatch(callApi(request, {}, {}));
  } catch (error) {
    expect(store.getActions()).toEqual([
      {
        data: {},
        query: query,
        type: request.FETCH,
      },
      apiResult,
      {
        data: {},
        query: query,
        type: request.FAIL,
        error: error,
      },
    ]);
  }
}

it('should refresh key access token if user is logged in with TheKey', () => {
  return test({ refreshToken: 'refresh' }, 'refreshAccessToken', { type: 'refreshed token' });
});

it('should refresh anonymous login if user is Try It Now', async() => {
  return test({ isFirstTime: true }, 'refreshAnonymousLogin', { type: 'refreshed anonymous token' });
});

