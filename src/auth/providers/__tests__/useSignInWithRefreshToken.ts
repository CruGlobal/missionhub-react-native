import { useMutation } from '@apollo/react-hooks';
import { act } from 'react-test-renderer';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderHookWithContext } from '../../../../testUtils';
import { SIGN_IN_WITH_REFRESH_TOKEN_MUTATION } from '../queries';
import {
  setAuthToken,
  getMissionHubRefreshToken,
  setMissionHubRefreshToken,
} from '../../authStore';
import { AuthError } from '../../constants';
import { useSignInWithRefreshToken } from '../useSignInWithRefreshToken';

jest.mock('../../authStore');

const token = 'test access token';
const refreshToken = 'test refresh token';

beforeEach(() => {
  (getMissionHubRefreshToken as jest.Mock).mockResolvedValue(null);
});

it('should get a new access token using the refresh token', async () => {
  (getMissionHubRefreshToken as jest.Mock).mockResolvedValue(refreshToken);

  const { result } = renderHookWithContext(() => useSignInWithRefreshToken(), {
    mocks: {
      Mutation: () => ({
        loginWithRefreshToken: () => ({ token, refreshToken }),
      }),
    },
  });

  await act(() => result.current.signInWithRefreshToken());

  expect(useMutation).toHaveBeenMutatedWith(
    SIGN_IN_WITH_REFRESH_TOKEN_MUTATION,
    {
      variables: { refreshToken },
    },
  );
  expect(setAuthToken).toHaveBeenCalledWith(token);
  expect(setMissionHubRefreshToken).toHaveBeenCalledWith(refreshToken);
});

it('should handle missing token from API', async () => {
  (getMissionHubRefreshToken as jest.Mock).mockResolvedValue(refreshToken);

  const { result } = renderHookWithContext(() => useSignInWithRefreshToken(), {
    mocks: {
      Mutation: () => ({
        loginWithRefreshToken: () => ({
          token: null,
        }),
      }),
    },
  });

  await expect(
    act(() => result.current.signInWithRefreshToken()),
  ).rejects.toEqual(AuthError.Unknown);

  await flushMicrotasksQueue();

  expect(result.current.error).toEqual(AuthError.Unknown);

  expect(useMutation).toHaveBeenMutatedWith(
    SIGN_IN_WITH_REFRESH_TOKEN_MUTATION,
    {
      variables: {
        refreshToken,
      },
    },
  );
  expect(setAuthToken).not.toHaveBeenCalled();
  expect(setMissionHubRefreshToken).not.toHaveBeenCalled();
});

it('should handle missing refresh token', async () => {
  (getMissionHubRefreshToken as jest.Mock).mockResolvedValue(null);

  const { result } = renderHookWithContext(() => useSignInWithRefreshToken());

  await expect(
    act(() => result.current.signInWithRefreshToken()),
  ).rejects.toEqual(AuthError.Unknown);

  await flushMicrotasksQueue();

  expect(result.current.error).toEqual(AuthError.Unknown);

  expect(useMutation).not.toHaveBeenMutated();
  expect(setAuthToken).not.toHaveBeenCalled();
});
