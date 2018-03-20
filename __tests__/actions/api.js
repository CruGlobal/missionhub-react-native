import callApi, { REQUESTS } from '../../src/actions/api';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import API_CALLS from '../../src/api';
import { EXPIRED_ACCESS_TOKEN } from '../../src/constants';
import { mockFnWithParams } from '../../testUtils';
import * as auth from '../../src/actions/auth';

const token = 'alsnjfjwqfpuqfeownposfnjnsaobjfaslkklnsfd';
const mockStore = configureStore([ thunk ])({
  auth: {
    token,
    refreshToken: 'asdfasdfasdf',
  },
});
const query = { access_token: token };
const request = REQUESTS.GET_ME;
const refreshTokenResult = { type: 'refreshed token' };
const error = {
  errors: [ { detail: EXPIRED_ACCESS_TOKEN } ],
};

global.APILOG = jest.fn();

beforeEach(() => expect.assertions(1));

it('should call', async() => {
  mockFnWithParams(API_CALLS, request.name, Promise.reject(error), query, {});
  mockFnWithParams(auth, 'refreshAccessToken', refreshTokenResult);

  try {
    await mockStore.dispatch(callApi(request, {}, {}));
  } catch (error) {
    expect(mockStore.getActions()).toEqual([
      {
        data: {},
        query: query,
        type: request.FETCH,
      },
      refreshTokenResult,
      {
        data: {},
        query: query,
        type: request.FAIL,
        error: error,
      },
    ]);
  }
});
