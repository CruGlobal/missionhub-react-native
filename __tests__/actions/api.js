import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi, { REQUESTS } from '../../src/actions/api';
import API_CALLS from '../../src/api';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  UPDATE_TOKEN,
} from '../../src/constants';
import { mockFnWithParams } from '../../testUtils';
import * as auth from '../../src/actions/auth';
import * as facebook from '../../src/actions/facebook';

const token = 'alsnjfjwqfpuqfeownposfnjnsaobjfaslkklnsfd';
const refreshToken = 'refresh';
const mockStore = configureStore([thunk]);
let store;
const mockAuthState = {
  token,
};

const accessTokenQuery = { access_token: token };
const refreshTokenData = `grant_type=refresh_token&refresh_token=${refreshToken}`;

const getMeRequest = REQUESTS.GET_ME;
const refreshRequest = REQUESTS.KEY_REFRESH_TOKEN;

const expiredTokenError = { errors: [{ detail: EXPIRED_ACCESS_TOKEN }] };
const invalidTokenError = { errors: [{ detail: INVALID_ACCESS_TOKEN }] };
const invalidGrantError = { error: INVALID_GRANT };

global.APILOG = jest.fn();

beforeEach(() => expect.assertions(1));

async function test(
  state,
  obj,
  request,
  error,
  method,
  methodParams,
  apiResult,
  query,
  data,
) {
  store = mockStore({ auth: { ...mockAuthState, ...state } });
  mockFnWithParams(
    API_CALLS,
    request.name,
    Promise.reject({ apiError: error }),
    query,
    data,
  );
  mockFnWithParams(obj, method, apiResult, ...methodParams);

  try {
    await store.dispatch(callApi(request, query, data));
  } catch (e) {
    expect(store.getActions()).toEqual([
      {
        data,
        query,
        type: request.FETCH,
      },
      apiResult,
    ]);
  }
}

it('should refresh key access token if user is logged in with TheKey with expired token', () => {
  return test(
    { refreshToken: 'refresh' },
    auth,
    getMeRequest,
    expiredTokenError,
    'refreshAccessToken',
    [],
    { type: 'refreshed token' },
    accessTokenQuery,
    {},
  );
});
it('should refresh key access token if user is logged in with TheKey with invalid token', () => {
  return test(
    { refreshToken: 'refresh' },
    auth,
    getMeRequest,
    invalidTokenError,
    'refreshAccessToken',
    [],
    { type: 'refreshed token' },
    accessTokenQuery,
    {},
  );
});

it('should refresh anonymous login if user is Try It Now with expired token', () => {
  return test(
    { isFirstTime: true },
    auth,
    getMeRequest,
    expiredTokenError,
    'refreshAnonymousLogin',
    [],
    { type: 'refreshed anonymous token' },
    accessTokenQuery,
    {},
  );
});
it('should refresh anonymous login if user is Try It Now with invalid token', () => {
  return test(
    { isFirstTime: true },
    auth,
    getMeRequest,
    invalidTokenError,
    'refreshAnonymousLogin',
    [],
    { type: 'refreshed anonymous token' },
    accessTokenQuery,
    {},
  );
});

it('should refresh facebook login if user is not logged in with TheKey or Try It Now with expired token', () => {
  return test(
    {},
    facebook,
    getMeRequest,
    expiredTokenError,
    'refreshMissionHubFacebookAccess',
    [],
    { type: 'refreshed fb login' },
    accessTokenQuery,
    {},
  );
});
it('should refresh facebook login if user is not logged in with TheKey or Try It Now with invalid token', () => {
  return test(
    {},
    facebook,
    getMeRequest,
    invalidTokenError,
    'refreshMissionHubFacebookAccess',
    [],
    { type: 'refreshed fb login' },
    accessTokenQuery,
    {},
  );
});

it('should logout if KEY_REFRESH_TOKEN fails with invalid_grant', () => {
  return test(
    { refreshToken: 'refresh' },
    auth,
    refreshRequest,
    invalidGrantError,
    'logout',
    [true],
    { type: 'logged out' },
    {},
    refreshTokenData,
  );
});

it("should not logout if invalid_grant is returned and request wasn't KEY_REFRESH_TOKEN", () => {
  auth.logout = jest.fn();
  store = mockStore({ auth: { ...mockAuthState } });

  mockFnWithParams(
    API_CALLS,
    getMeRequest.name,
    Promise.reject({ apiError: invalidGrantError }),
    accessTokenQuery,
    {},
  );

  expect(auth.logout).not.toHaveBeenCalled();
});

it('should update token if present in response', async () => {
  store = mockStore({ auth: { ...mockAuthState } });
  const newToken =
    'pfiqwfioqwioefiqowfejiqwfipoioqwefpiowqniopnifiooiwfemiopqwoimefimwqefponioqwfenoiwefinonoiwqefnoip';
  mockFnWithParams(
    API_CALLS,
    getMeRequest.name,
    Promise.resolve({ sessionHeader: newToken }),
    accessTokenQuery,
    {},
  );

  await store.dispatch(callApi(getMeRequest, {}, {}));

  expect(store.getActions()).toEqual([
    {
      data: {},
      query: accessTokenQuery,
      type: getMeRequest.FETCH,
    },
    {
      data: {},
      query: accessTokenQuery,
      type: getMeRequest.SUCCESS,
      results: { response: undefined, meta: undefined },
    },
    {
      type: UPDATE_TOKEN,
      token: newToken,
    },
  ]);
});
