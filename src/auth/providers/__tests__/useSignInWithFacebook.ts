import { useMutation } from '@apollo/react-hooks';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { act } from 'react-test-renderer';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderHookWithContext } from '../../../../testUtils';
import {
  setAuthToken,
  getAnonymousUid,
  deleteAnonymousUid,
} from '../../authStore';
import {
  useSignInWithFacebook,
  FACEBOOK_SCOPE,
} from '../useSignInWithFacebook';
import { SIGN_IN_WITH_FACEBOOK_MUTATION } from '../queries';
import { AuthError } from '../../constants';

jest.mock('../../authStore');
jest.mock('react-native-fbsdk', () => ({
  AccessToken: {
    getCurrentAccessToken: jest.fn(),
    refreshCurrentAccessTokenAsync: jest.fn(),
  },
  LoginManager: {
    logInWithPermissions: jest.fn(),
    logOut: jest.fn(),
  },
}));

const facebookAccessToken = 'test facebook access token';
const token = 'test access token';
const anonymousUid = 'test anonymous user id';

beforeEach(() => {
  (getAnonymousUid as jest.Mock).mockResolvedValue(anonymousUid);
  (AccessToken.refreshCurrentAccessTokenAsync as jest.Mock).mockRejectedValue(
    null,
  );
  (LoginManager.logInWithPermissions as jest.Mock).mockResolvedValue({});
  (AccessToken.getCurrentAccessToken as jest.Mock).mockResolvedValue(null);
});

it('should sign in wih Facebook', async () => {
  (AccessToken.getCurrentAccessToken as jest.Mock)
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({ accessToken: facebookAccessToken });

  const { result } = renderHookWithContext(() => useSignInWithFacebook(), {
    mocks: {
      Mutation: () => ({
        loginWithFacebook: () => ({ token }),
      }),
    },
  });

  await act(() => result.current.signInWithFacebook());

  expect(AccessToken.refreshCurrentAccessTokenAsync).toHaveBeenCalled();
  expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
    FACEBOOK_SCOPE,
  );
  expect(AccessToken.getCurrentAccessToken).toHaveBeenCalledTimes(2);
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_FACEBOOK_MUTATION, {
    variables: {
      accessToken: facebookAccessToken,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should refresh Facebook auth', async () => {
  (AccessToken.getCurrentAccessToken as jest.Mock).mockResolvedValueOnce({
    accessToken: facebookAccessToken,
  });

  const { result } = renderHookWithContext(() => useSignInWithFacebook(), {
    mocks: {
      Mutation: () => ({
        loginWithFacebook: () => ({ token }),
      }),
    },
  });

  await act(() => result.current.signInWithFacebook());

  expect(AccessToken.refreshCurrentAccessTokenAsync).toHaveBeenCalled();
  expect(LoginManager.logInWithPermissions).not.toHaveBeenCalled();
  expect(AccessToken.getCurrentAccessToken).toHaveBeenCalledTimes(1);
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_FACEBOOK_MUTATION, {
    variables: {
      accessToken: facebookAccessToken,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should handle missing token from API', async () => {
  (AccessToken.getCurrentAccessToken as jest.Mock)
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({ accessToken: facebookAccessToken });

  const { result } = renderHookWithContext(() => useSignInWithFacebook(), {
    mocks: {
      Mutation: () => ({
        loginWithFacebook: () => ({ token: null }),
      }),
    },
  });

  await expect(act(() => result.current.signInWithFacebook())).rejects.toEqual(
    AuthError.Unknown,
  );

  await flushMicrotasksQueue();

  expect(result.current.error).toEqual(AuthError.Unknown);

  expect(AccessToken.refreshCurrentAccessTokenAsync).toHaveBeenCalled();
  expect(LoginManager.logInWithPermissions).toHaveBeenCalledWith(
    FACEBOOK_SCOPE,
  );
  expect(AccessToken.getCurrentAccessToken).toHaveBeenCalledTimes(2);
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_FACEBOOK_MUTATION, {
    variables: {
      accessToken: facebookAccessToken,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).not.toHaveBeenCalled();
  expect(setAuthToken).not.toHaveBeenCalledWith(token);
  expect(LoginManager.logOut).toHaveBeenCalled();
});
