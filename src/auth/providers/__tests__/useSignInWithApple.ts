import { useMutation } from '@apollo/react-hooks';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import { act } from 'react-test-renderer';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderHookWithContext } from '../../../../testUtils';
import {
  setAuthToken,
  setMissionHubRefreshToken,
  getAnonymousUid,
  deleteAnonymousUid,
  setAppleUserId,
} from '../../authStore';
import { useSignInWithApple } from '../useSignInWithApple';
import { SIGN_IN_WITH_APPLE_MUTATION } from '../queries';
import { AuthError } from '../../constants';

jest.mock('../../authStore');
jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: {
    ...jest.requireActual('@invertase/react-native-apple-authentication')
      .appleAuth,
    isSupported: false,
    performRequest: jest.fn(),
    getCredentialStateForUser: jest.fn(),
  },
  appleAuthAndroid: {
    isSupported: false,
    configure: jest.fn(),
    signIn: jest.fn(),
    Scope: { ALL: 'all' },
    ResponseType: { ALL: 'all' },
  },
}));

const token = 'test access token';
const anonymousUid = 'test anonymous user id';
const appleIdToken = 'test apple identity token';
const appleUserId = 'test apple user id';
const firstName = 'Test first name';
const lastName = 'Test last name';
const email = 'appleemail@test.com';
const missionhubRefreshToken = 'test refresh token';

beforeEach(() => {
  (getAnonymousUid as jest.Mock).mockResolvedValue(anonymousUid);
});

describe('ios', () => {
  beforeEach(() => {
    appleAuth.isSupported = true;
    appleAuthAndroid.isSupported = false;
  });

  it('should sign in wih Apple', async () => {
    (appleAuth.performRequest as jest.Mock).mockResolvedValue({
      user: appleUserId,
      identityToken: appleIdToken,
      fullName: { givenName: firstName, familyName: lastName },
    });
    (appleAuth.getCredentialStateForUser as jest.Mock).mockResolvedValue(
      appleAuth.State.AUTHORIZED,
    );

    const { result } = renderHookWithContext(() => useSignInWithApple(), {
      mocks: {
        Mutation: () => ({
          loginWithApple: () => ({
            token,
            refreshToken: missionhubRefreshToken,
          }),
        }),
      },
    });

    await act(() => result.current.signInWithApple());

    expect(appleAuth.performRequest).toHaveBeenCalledWith({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    expect(appleAuth.getCredentialStateForUser).toHaveBeenCalledWith(
      appleUserId,
    );
    expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_APPLE_MUTATION, {
      variables: {
        appleIdToken,
        firstName,
        lastName,
        anonymousUid,
      },
    });
    expect(deleteAnonymousUid).toHaveBeenCalled();
    expect(setAuthToken).toHaveBeenCalledWith(token);
    expect(setMissionHubRefreshToken).toHaveBeenCalledWith(
      missionhubRefreshToken,
    );
    expect(setAppleUserId).toHaveBeenCalledWith(appleUserId);
  });

  it('should refresh Apple sign in', async () => {
    (appleAuth.performRequest as jest.Mock).mockResolvedValue({
      user: appleUserId,
      identityToken: appleIdToken,
      fullName: { givenName: firstName, familyName: lastName },
    });
    (appleAuth.getCredentialStateForUser as jest.Mock).mockResolvedValue(
      appleAuth.State.AUTHORIZED,
    );

    const { result } = renderHookWithContext(() => useSignInWithApple(), {
      mocks: {
        Mutation: () => ({
          loginWithApple: () => ({ token }),
        }),
      },
    });

    await act(() => result.current.signInWithApple(appleUserId));

    expect(appleAuth.performRequest).toHaveBeenCalledWith({
      requestedOperation: appleAuth.Operation.REFRESH,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      user: appleUserId,
    });
    expect(appleAuth.getCredentialStateForUser).toHaveBeenCalledWith(
      appleUserId,
    );
    expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_APPLE_MUTATION, {
      variables: {
        appleIdToken,
        firstName,
        lastName,
        anonymousUid,
      },
    });
    expect(deleteAnonymousUid).toHaveBeenCalled();
    expect(setAuthToken).toHaveBeenCalledWith(token);
    expect(setAppleUserId).toHaveBeenCalledWith(appleUserId);
  });

  it('should handle missing token from API', async () => {
    (appleAuth.performRequest as jest.Mock).mockResolvedValue({
      user: appleUserId,
      identityToken: appleIdToken,
      fullName: { givenName: firstName, familyName: lastName },
    });
    (appleAuth.getCredentialStateForUser as jest.Mock).mockResolvedValue(
      appleAuth.State.AUTHORIZED,
    );

    const { result } = renderHookWithContext(() => useSignInWithApple(), {
      mocks: {
        Mutation: () => ({
          loginWithApple: () => ({ token: null }),
        }),
      },
    });

    await expect(act(() => result.current.signInWithApple())).rejects.toEqual(
      AuthError.Unknown,
    );

    await flushMicrotasksQueue();

    expect(result.current.error).toEqual(AuthError.Unknown);

    expect(appleAuth.performRequest).toHaveBeenCalledWith({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    expect(appleAuth.getCredentialStateForUser).toHaveBeenCalledWith(
      appleUserId,
    );
    expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_APPLE_MUTATION, {
      variables: {
        appleIdToken,
        firstName,
        lastName,
        anonymousUid,
      },
    });
    expect(deleteAnonymousUid).not.toHaveBeenCalled();
    expect(setAuthToken).not.toHaveBeenCalledWith(token);
    expect(setAppleUserId).not.toHaveBeenCalledWith(appleUserId);
  });
});

describe('android', () => {
  beforeEach(() => {
    appleAuth.isSupported = false;
    appleAuthAndroid.isSupported = true;
  });

  it('should sign in wih Apple', async () => {
    (appleAuthAndroid.signIn as jest.Mock).mockResolvedValue({
      id_token: appleIdToken,
      user: { name: { firstName, lastName }, email },
    });

    const { result } = renderHookWithContext(() => useSignInWithApple(), {
      mocks: {
        Mutation: () => ({
          loginWithApple: () => ({ token }),
        }),
      },
    });

    await act(() => result.current.signInWithApple());

    expect(appleAuthAndroid.configure).toHaveBeenCalledWith({
      clientId: 'com.missionhub.webauth',
      redirectUri: 'https://missionhub.com/auth',
      scope: appleAuthAndroid.Scope.ALL,
      responseType: appleAuthAndroid.ResponseType.ALL,
    });
    expect(appleAuthAndroid.signIn).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(SIGN_IN_WITH_APPLE_MUTATION, {
      variables: {
        appleIdToken,
        firstName,
        lastName,
        anonymousUid,
      },
    });
    expect(deleteAnonymousUid).toHaveBeenCalled();
    expect(setAuthToken).toHaveBeenCalledWith(token);
    expect(setAppleUserId).toHaveBeenCalledWith(email);
  });
});
