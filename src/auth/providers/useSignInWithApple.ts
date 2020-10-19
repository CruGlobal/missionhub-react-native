import { useCallback, useState } from 'react';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import { useIsEmulator } from 'react-native-device-info';
import { useMutation } from '@apollo/react-hooks';

import {
  setAuthToken,
  setMissionHubRefreshToken,
  getAnonymousUid,
  setAppleUserId,
  deleteAnonymousUid,
} from '../authStore';
import { AuthError } from '../constants';
import { rollbar } from '../../utils/rollbar.config';

import { SIGN_IN_WITH_APPLE_MUTATION } from './queries';
import {
  SignInWithApple,
  SignInWithAppleVariables,
} from './__generated__/SignInWithApple';

interface SignInWithAppleResponse {
  identityToken: string;
  userId: string;
  firstName?: string;
  lastName?: string;
}

export const useSignInWithApple = () => {
  const [providerAuthInProgress, setProviderAuthInProgress] = useState(false);
  const [error, setError] = useState(AuthError.None);

  const isEmulator = useIsEmulator();

  const [apiSignInWithApple, { loading }] = useMutation<
    SignInWithApple,
    SignInWithAppleVariables
  >(SIGN_IN_WITH_APPLE_MUTATION);

  const onIos = useCallback(async (refreshUser?: string): Promise<
    SignInWithAppleResponse
  > => {
    if (!appleAuth.isSupported) {
      throw new Error(
        'Tried using Sign in with Apple on an unsupported iOS device',
      );
    }

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: refreshUser
        ? appleAuth.Operation.REFRESH
        : appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      user: refreshUser,
    });

    const credentialStateAuthorized = isEmulator
      ? true
      : // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        (await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user,
        )) === appleAuth.State.AUTHORIZED;

    // use credentialState response to ensure the user is authenticated
    if (credentialStateAuthorized) {
      if (appleAuthRequestResponse.identityToken) {
        return {
          identityToken: appleAuthRequestResponse.identityToken,
          userId: appleAuthRequestResponse.user,
          firstName: appleAuthRequestResponse.fullName?.givenName ?? undefined,
          lastName: appleAuthRequestResponse.fullName?.familyName ?? undefined,
        };
      } else {
        throw new Error(
          'appleAuth.performRequest did not return an identityToken',
        );
      }
    } else {
      throw new Error('Sign in with Apple credential state is not authorized');
    }
  }, []);

  const onAndroid = useCallback(async (): Promise<SignInWithAppleResponse> => {
    appleAuthAndroid.configure({
      clientId: 'com.missionhub.webauth',
      redirectUri: 'https://missionhub.com/auth',
      scope: appleAuthAndroid.Scope.ALL,
      responseType: appleAuthAndroid.ResponseType.ALL,
    });

    try {
      const response = await appleAuthAndroid.signIn();

      if (response?.id_token) {
        return {
          identityToken: response.id_token,
          userId: response.user?.email ?? 'apple user',
          firstName: response.user?.name?.firstName,
          lastName: response.user?.name?.lastName,
        };
      } else {
        throw new Error(
          'AppleAuthenticationAndroid.signIn did not respond with the necessary details',
        );
      }
    } catch (error) {
      if (error && error.message) {
        switch (error.message) {
          case appleAuthAndroid.Error.NOT_CONFIGURED:
            throw new Error('AppleAuthenticationAndroid not configured yet.');
          case appleAuthAndroid.Error.SIGNIN_FAILED:
            throw new Error('AppleAuthenticationAndroid sign in failed.');
          case appleAuthAndroid.Error.SIGNIN_CANCELLED:
            throw AuthError.None;
        }
      }
      throw error;
    }
  }, []);

  const signInWithApple = useCallback(async (refreshUser?: string) => {
    setError(AuthError.None);
    setProviderAuthInProgress(true);
    try {
      const {
        identityToken,
        userId,
        firstName,
        lastName,
      } = await (appleAuth.isSupported
        ? onIos(refreshUser)
        : appleAuthAndroid.isSupported
        ? onAndroid()
        : (() => {
            throw new Error('Sign in with Apple is not supported');
          })());

      setProviderAuthInProgress(false);
      const anonymousUid = await getAnonymousUid();
      const { data } = await apiSignInWithApple({
        variables: {
          appleIdToken: identityToken,
          firstName,
          lastName,
          anonymousUid,
        },
      });

      if (data?.loginWithApple?.token) {
        await setAuthToken(data.loginWithApple.token);
        data.loginWithApple.refreshToken &&
          (await setMissionHubRefreshToken(data.loginWithApple.refreshToken));
        await setAppleUserId(userId);
        await deleteAnonymousUid();
      } else {
        throw new Error('apiSignInWithTheKey did not return an access token');
      }
    } catch (error) {
      if (error === AuthError.None) {
        throw AuthError.None;
      } else {
        setError(AuthError.Unknown);
        rollbar.error(error);
        throw AuthError.Unknown;
      }
    } finally {
      setProviderAuthInProgress(false);
    }
  }, []);

  return {
    signInWithApple,
    loading: providerAuthInProgress || loading,
    error: error,
  };
};
