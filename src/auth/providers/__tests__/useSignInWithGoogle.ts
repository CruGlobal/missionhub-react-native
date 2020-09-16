import { useMutation } from '@apollo/react-hooks';
import { act } from 'react-test-renderer';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';

import { renderHookWithContext } from '../../../../testUtils';
import {
  setAuthToken,
  getAnonymousUid,
  deleteAnonymousUid,
} from '../../authStore';
import { useSignInWithGoogle } from '../useSignInWithGoogle';
import { SIGN_IN_WITH_GOOGLE_MUTATION } from '../queries';
import { mockUserInfo } from '../../../../__mock__/@react-native-community/google-signin';
import { AuthError } from '../../constants';

jest.mock('../../authStore');

const token = 'test access token';
const anonymousUid = 'test anonymous user id';

beforeEach(() => {
  (getAnonymousUid as jest.Mock).mockResolvedValue(anonymousUid);
  (GoogleSignin.signInSilently as jest.Mock).mockRejectedValue({
    code: statusCodes.SIGN_IN_REQUIRED,
  });
});

it('should sign in wih Google', async () => {
  const { result } = renderHookWithContext(() => useSignInWithGoogle(), {
    mocks: {
      Mutation: () => ({
        loginWithGoogle: () => ({ token }),
      }),
    },
  });

  await act(() => result.current.signInWithGoogle());

  expect(GoogleSignin.configure).toHaveBeenCalledWith({
    webClientId:
      '208966923006-psifsd9u6ia0bc5bbt8racvdqqrb4u05.apps.googleusercontent.com',
    offlineAccess: true,
  });
  expect(GoogleSignin.signInSilently).toHaveBeenCalled();
  expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith({
    showPlayServicesUpdateDialog: true,
  });
  expect(GoogleSignin.signIn).toHaveBeenCalled();
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_GOOGLE_MUTATION, {
    variables: {
      authorizationCode: mockUserInfo.serverAuthCode,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should refresh Google auth', async () => {
  (GoogleSignin.signInSilently as jest.Mock).mockResolvedValue(mockUserInfo);

  const { result } = renderHookWithContext(() => useSignInWithGoogle(), {
    mocks: {
      Mutation: () => ({
        loginWithGoogle: () => ({ token }),
      }),
    },
  });

  await act(() => result.current.signInWithGoogle());

  expect(GoogleSignin.configure).toHaveBeenCalledWith({
    webClientId:
      '208966923006-psifsd9u6ia0bc5bbt8racvdqqrb4u05.apps.googleusercontent.com',
    offlineAccess: true,
  });
  expect(GoogleSignin.signInSilently).toHaveBeenCalled();
  expect(GoogleSignin.hasPlayServices).not.toHaveBeenCalledWith();
  expect(GoogleSignin.signIn).not.toHaveBeenCalled();
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_GOOGLE_MUTATION, {
    variables: {
      authorizationCode: mockUserInfo.serverAuthCode,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).toHaveBeenCalled();
  expect(setAuthToken).toHaveBeenCalledWith(token);
});

it('should handle missing token from API', async () => {
  const { result } = renderHookWithContext(() => useSignInWithGoogle(), {
    mocks: {
      Mutation: () => ({
        loginWithGoogle: () => ({ token: null }),
      }),
    },
  });

  await expect(act(() => result.current.signInWithGoogle())).rejects.toEqual(
    AuthError.Unknown,
  );

  await flushMicrotasksQueue();

  expect(result.current.error).toEqual(AuthError.Unknown);

  expect(GoogleSignin.configure).toHaveBeenCalledWith({
    webClientId:
      '208966923006-psifsd9u6ia0bc5bbt8racvdqqrb4u05.apps.googleusercontent.com',
    offlineAccess: true,
  });
  expect(GoogleSignin.signInSilently).toHaveBeenCalled();
  expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith({
    showPlayServicesUpdateDialog: true,
  });
  expect(GoogleSignin.signIn).toHaveBeenCalled();
  expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_GOOGLE_MUTATION, {
    variables: {
      authorizationCode: mockUserInfo.serverAuthCode,
      anonymousUid,
    },
  });
  expect(deleteAnonymousUid).not.toHaveBeenCalled();
  expect(setAuthToken).not.toHaveBeenCalledWith(token);
});
