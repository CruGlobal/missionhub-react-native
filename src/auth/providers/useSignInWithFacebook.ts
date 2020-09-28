import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

import {
  setAuthToken,
  getAnonymousUid,
  deleteAnonymousUid,
} from '../authStore';
import { AuthError } from '../constants';
import { rollbar } from '../../utils/rollbar.config';

import {
  SignInWithFacebook,
  SignInWithFacebookVariables,
} from './__generated__/SignInWithFacebook';
import { SIGN_IN_WITH_FACEBOOK_MUTATION } from './queries';

export const FACEBOOK_SCOPE = ['public_profile', 'email'];

export const useSignInWithFacebook = () => {
  const [providerAuthInProgress, setProviderAuthInProgress] = useState(false);
  const [error, setError] = useState(AuthError.None);

  const [apiSignInWithFacebook, { loading }] = useMutation<
    SignInWithFacebook,
    SignInWithFacebookVariables
  >(SIGN_IN_WITH_FACEBOOK_MUTATION, { context: { public: true } });

  const showFacebookPrompt = useCallback(async () => {
    const result = await LoginManager.logInWithPermissions(FACEBOOK_SCOPE);
    if (result.isCancelled) {
      throw AuthError.None;
    }

    return getFacebookAccessToken();
  }, []);

  const getFacebookAccessToken = useCallback(async () => {
    try {
      const { accessToken } = (await AccessToken.getCurrentAccessToken()) || {};

      return accessToken;
    } catch {
      return undefined;
    }
  }, []);

  const signInWithFacebook = useCallback(async () => {
    setError(AuthError.None);
    setProviderAuthInProgress(true);

    try {
      try {
        await AccessToken.refreshCurrentAccessTokenAsync();
      } catch {}

      const accessToken =
        (await getFacebookAccessToken()) ?? (await showFacebookPrompt());

      if (!accessToken) {
        throw Error("Facebook access token doesn't exist");
      }

      const anonymousUid = await getAnonymousUid();
      const { data } = await apiSignInWithFacebook({
        variables: { accessToken, anonymousUid },
      });

      if (data?.loginWithFacebook?.token) {
        await setAuthToken(data.loginWithFacebook.token);
        await deleteAnonymousUid();
      } else {
        throw new Error('apiSignInWithFacebook did not return an access token');
      }
    } catch (error) {
      if (error === AuthError.None) {
        throw AuthError.None;
      } else {
        setError(AuthError.Unknown);
        rollbar.error(error);
        LoginManager.logOut();
        throw AuthError.Unknown;
      }
    } finally {
      setProviderAuthInProgress(false);
    }
  }, []);

  return {
    signInWithFacebook,
    loading: providerAuthInProgress || loading,
    error: error,
  };
};
