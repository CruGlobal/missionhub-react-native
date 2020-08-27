import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../api';
import { ApiRouteConfigEntry, REQUESTS } from '../../api/routes';
import API_CALLS from '../../api';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
} from '../../constants';
import { logout } from '../auth/auth';
import {
  setAuthToken,
  getCachedAuthToken,
  getRefreshToken,
} from '../../auth/authStore';
import { authRefresh } from '../../auth/provideAuthRefresh';

jest.mock('../../api');
jest.mock('../auth/auth');
jest.mock('../../reducers/nav', () => null);
jest.mock('../../auth/authStore');
jest.mock('../../auth/provideAuthRefresh', () => ({ authRefresh: jest.fn() }));

const token = 'alsnjfjwqfpuqfeownposfnjnsaobjfaslkklnsfd';
const refreshToken = 'refresh';
const mockStore = configureStore([thunk]);
const mockActionResult = { type: 'mockActionResult' };

const accessTokenQuery = { access_token: token };
const refreshTokenData = `grant_type=refresh_token&refresh_token=${refreshToken}`;

const getMeRequest = REQUESTS.GET_ME;
const refreshRequest = REQUESTS.KEY_REFRESH_TOKEN;

const expiredTokenError = {
  apiError: { errors: [{ detail: EXPIRED_ACCESS_TOKEN }] },
};
const invalidTokenError = {
  apiError: { errors: [{ detail: INVALID_ACCESS_TOKEN }] },
};
const invalidGrantError = { apiError: { error: INVALID_GRANT } };

// @ts-ignore
global.APILOG = jest.fn();

async function testCallApiWithError({
  request,
  error,
  action,
  actionParams = [],
  actionShouldNotBeCalled = false,
  query = {},
  data = {},
  shouldReject = false,
}: {
  request: ApiRouteConfigEntry;
  error: { apiError: { errors: { detail: string }[] } | { error: string } };
  action: () => void;
  actionParams?: boolean[];
  actionShouldNotBeCalled?: boolean;
  query?: { access_token?: string };
  data?: Record<string, never> | string;
  shouldReject?: boolean;
}) {
  (API_CALLS[request.name] as jest.Mock).mockReturnValue(Promise.reject(error));
  (action as jest.Mock).mockReturnValue(mockActionResult);
  const store = mockStore();

  if (!shouldReject) {
    // @ts-ignore
    await store.dispatch(callApi(request, query, data));
  } else {
    // @ts-ignore
    await expect(store.dispatch(callApi(request, query, data))).rejects.toEqual(
      error,
    );
  }

  expect(API_CALLS[request.name]).toHaveBeenCalledWith(query, data);
  if (!actionShouldNotBeCalled) {
    expect(action).toHaveBeenCalledWith(...actionParams);
  } else {
    expect(action).not.toHaveBeenCalledWith(...actionParams);
  }

  expect(store.getActions()).toEqual([
    {
      data,
      query,
      type: request.FETCH,
    },
    ...(actionShouldNotBeCalled || action === authRefresh
      ? []
      : [mockActionResult]),
  ]);
}

it('should handle expired token', async () => {
  await testCallApiWithError({
    request: getMeRequest,
    error: expiredTokenError,
    action: authRefresh,
    query: accessTokenQuery,
  });
  expect.hasAssertions();
});

it('should handle invalid token', async () => {
  await testCallApiWithError({
    request: getMeRequest,
    error: invalidTokenError,
    action: authRefresh,
    query: accessTokenQuery,
  });
  expect.hasAssertions();
});

it('should logout if KEY_REFRESH_TOKEN fails with invalid_grant', async () => {
  (getRefreshToken as jest.Mock).mockReturnValue('refresh');
  await testCallApiWithError({
    request: refreshRequest,
    error: invalidGrantError,
    action: logout,
    actionParams: [true],
    data: refreshTokenData,
  });
  expect.hasAssertions();
});

it("should not logout if invalid_grant is returned and request wasn't KEY_REFRESH_TOKEN", async () => {
  await testCallApiWithError({
    request: getMeRequest,
    error: invalidGrantError,
    action: logout,
    actionShouldNotBeCalled: true,
    query: accessTokenQuery,
    shouldReject: true,
  });
  expect.hasAssertions();
});

it('should update token if present in response', async () => {
  (getCachedAuthToken as jest.Mock).mockReturnValue(token);
  const store = mockStore();
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
  ]);
  expect(setAuthToken).toHaveBeenCalledWith(newToken);
});
