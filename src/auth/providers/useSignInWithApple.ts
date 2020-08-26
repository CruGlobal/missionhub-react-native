import { useCallback, useState } from 'react';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import DeviceInfo from 'react-native-device-info';
import AppleAuthenticationAndroid, {
  NOT_CONFIGURED_ERROR,
  SIGNIN_CANCELLED_ERROR,
  SIGNIN_FAILED_ERROR,
  ResponseType,
  Scope,
} from 'react-native-apple-authentication-android';
import { useMutation } from '@apollo/react-hooks';

import { isAndroid } from '../../utils/common';
import {
  setAuthToken,
  getAnonymousUid,
  deleteAllAuthTokens,
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
  firstName?: string;
  lastName?: string;
}

export const useSignInWithApple = () => {
  const [providerAuthInProgress, setProviderAuthInProgress] = useState(false);
  const [error, setError] = useState(AuthError.None);

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
        ? AppleAuthRequestOperation.REFRESH
        : AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
      user: refreshUser,
    });

    const credentialStateAuthorized = DeviceInfo.isEmulator()
      ? true
      : // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        (await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user,
        )) === AppleAuthCredentialState.AUTHORIZED;

    // use credentialState response to ensure the user is authenticated
    if (credentialStateAuthorized) {
      if (appleAuthRequestResponse.identityToken) {
        return {
          identityToken: appleAuthRequestResponse.identityToken,
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
    AppleAuthenticationAndroid.configure({
      clientId: 'com.missionhub.webauth',
      redirectUri: 'https://missionhub.com/auth',
      scope: Scope.ALL,
      responseType: ResponseType.ALL,
    });

    try {
      const response = await AppleAuthenticationAndroid.signIn();

      if (response?.id_token) {
        return {
          identityToken: response.id_token,
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
          case NOT_CONFIGURED_ERROR:
            throw new Error('AppleAuthenticationAndroid not configured yet.');
          case SIGNIN_FAILED_ERROR:
            throw new Error('AppleAuthenticationAndroid sign in failed.');
          case SIGNIN_CANCELLED_ERROR:
            throw AuthError.None;
        }
      }
      throw error;
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    setError(AuthError.None);
    setProviderAuthInProgress(true);
    try {
      const { identityToken, firstName, lastName } = await (isAndroid
        ? onAndroid()
        : onIos());
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
        await deleteAllAuthTokens();
      } else {
        throw new Error('apiSignInWithTheKey did not return an access token');
      }
    } catch (error) {
      if (error === AuthError.None) {
        throw error;
      } else {
        setError(AuthError.Unknown);
        rollbar.error(error);
        throw error;
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
