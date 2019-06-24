/* eslint max-params: 0 */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import API_CALLS from '../../api';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  UPDATE_TOKEN,
} from '../../constants';
import { refreshAnonymousLogin } from '../auth/anonymous';
import { logout } from '../auth/auth';
import { refreshMissionHubFacebookAccess } from '../auth/facebook';
import { refreshAccessToken } from '../auth/key';

jest.mock('../../api');
jest.mock('../auth/anonymous');
jest.mock('../auth/auth');
jest.mock('../auth/facebook');
jest.mock('../auth/key');

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

async function test(
  state,
  request,
  error,
  method,
  methodParams,
  apiResult,
  query,
  data,
) {
  store = mockStore({ auth: { ...mockAuthState, ...state } });
  API_CALLS[request.name].mockReturnValue(Promise.reject({ apiError: error }));
  method.mockReturnValue(apiResult);

  try {
    await store.dispatch(callApi(request, query, data));
  } catch (e) {
    expect(API_CALLS[request.name]).toHaveBeenCalledWith(query, data);
    expect(method).toHaveBeenCalledWith(...methodParams);

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

it('should logout if KEY_REFRESH_TOKEN fails with invalid_grant', () => {
  return test(
    { refreshToken: 'refresh' },
    refreshRequest,
    invalidGrantError,
    logout,
    [true],
    { type: 'logged out' },
    {},
    refreshTokenData,
  );
});

it("should not logout if invalid_grant is returned and request wasn't KEY_REFRESH_TOKEN", async () => {
  store = mockStore({ auth: { ...mockAuthState } });

  API_CALLS[getMeRequest.name].mockReturnValue(
    Promise.reject({ apiError: invalidGrantError }),
  );

  await expect(store.dispatch(callApi(getMeRequest, {}, {}))).rejects.toEqual({
    apiError: {
      error: 'invalid_grant',
    },
  });

  expect(API_CALLS[getMeRequest.name]).toHaveBeenCalledWith(
    accessTokenQuery,
    {},
  );
  expect(logout).not.toHaveBeenCalled();
});

it('should update token if present in response', async () => {
  store = mockStore({ auth: { ...mockAuthState } });
  const newToken =
    'pfiqwfioqwioefiqowfejiqwfipoioqwefpiowqniopnifiooiwfemiopqwoimefimwqefponioqwfenoiwefinonoiwqefnoip';

  API_CALLS[getMeRequest.name].mockReturnValue(
    Promise.resolve({ sessionHeader: newToken }),
  );

  await store.dispatch(callApi(getMeRequest, {}, {}));

  expect(API_CALLS[getMeRequest.name]).toHaveBeenCalledWith(
    accessTokenQuery,
    {},
  );

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
