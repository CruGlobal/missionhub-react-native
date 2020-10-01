import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';

import {
  setAuthToken,
  getAnonymousUid,
  deleteAnonymousUid,
} from '../authStore';
import { AuthError } from '../constants';
import { rollbar } from '../../utils/rollbar.config';

import { SIGN_IN_WITH_GOOGLE_MUTATION } from './queries';
import {
  SignInWithGoogle,
  SignInWithGoogleVariables,
} from './__generated__/SignInWithGoogle';

export const webClientId =
  '208966923006-psifsd9u6ia0bc5bbt8racvdqqrb4u05.apps.googleusercontent.com';

export const useSignInWithGoogle = () => {
  const [providerAuthInProgress, setProviderAuthInProgress] = useState(false);
  const [error, setError] = useState(AuthError.None);

  const [apiSignInWithGoogle, { loading }] = useMutation<
    SignInWithGoogle,
    SignInWithGoogleVariables
  >(SIGN_IN_WITH_GOOGLE_MUTATION, { context: { public: true } });

  const performSignIn = useCallback(async () => {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
    });

    const ERROR_NO_ID_TOKEN = "Google id token doesn't exist";

    try {
      const { idToken } = await GoogleSignin.signInSilently();
      if (!idToken) {
        throw { code: ERROR_NO_ID_TOKEN };
      }
      return idToken;
    } catch (error) {
      if (
        error.code === ERROR_NO_ID_TOKEN ||
        error.code === statusCodes.SIGN_IN_REQUIRED
      ) {
        try {
          await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
          });
          const { idToken } = await GoogleSignin.signIn();
          if (!idToken) {
            throw new Error(ERROR_NO_ID_TOKEN);
          }
          return idToken;
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            throw AuthError.None;
          } else if (error.code === statusCodes.IN_PROGRESS) {
            throw AuthError.None;
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            throw AuthError.None;
          } else {
            throw error;
          }
        }
      } else {
        throw error;
      }
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(AuthError.None);
    setProviderAuthInProgress(true);

    try {
      const idToken = await performSignIn();

      const anonymousUid = await getAnonymousUid();
      const { data } = await apiSignInWithGoogle({
        variables: { idToken: idToken, anonymousUid },
      });

      if (data?.loginWithGoogle?.token) {
        await setAuthToken(data.loginWithGoogle.token);
        await deleteAnonymousUid();
      } else {
        throw new Error('apiSignInWithGoogle did not return an access token');
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
    signInWithGoogle: signInWithGoogle,
    loading: providerAuthInProgress || loading,
    error: error,
  };
};
