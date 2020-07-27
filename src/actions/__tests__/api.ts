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
import { logout, handleInvalidAccessToken } from '../auth/auth';

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

// @ts-ignore
global.APILOG = jest.fn();

async function test(
  // @ts-ignore
  state,
  // @ts-ignore
  request,
  // @ts-ignore
  error,
  // @ts-ignore
  method,
  // @ts-ignore
  methodParams,
  // @ts-ignore
  apiResult,
  // @ts-ignore
  query,
  // @ts-ignore
  data,
) {
  store = mockStore({ auth: { ...mockAuthState, ...state } });
  // @ts-ignore
  API_CALLS[request.name].mockReturnValue(Promise.reject({ apiError: error }));
  method.mockReturnValue(apiResult);

  try {
    // @ts-ignore
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

it('should handle expired token', () => {
  return test(
    { refreshToken: 'refresh' },
    getMeRequest,
    expiredTokenError,
    handleInvalidAccessToken,
    [],
    { type: 'expired token' },
    accessTokenQuery,
    {},
  );
});

it('should handle invalid token', () => {
  return test(
    { refreshToken: 'refresh' },
    getMeRequest,
    invalidTokenError,
    handleInvalidAccessToken,
    [],
    { type: 'invalid token' },
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

  // @ts-ignore
  API_CALLS[getMeRequest.name].mockReturnValue(
    Promise.reject({ apiError: invalidGrantError }),
  );

  // @ts-ignore
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

  // @ts-ignore
  API_CALLS[getMeRequest.name].mockReturnValue(
    Promise.resolve({ sessionHeader: newToken }),
  );

  // @ts-ignore
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
