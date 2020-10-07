import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import {
  setAuthToken,
  getMissionHubRefreshToken,
  setMissionHubRefreshToken,
} from '../authStore';
import { AuthError } from '../constants';
import { rollbar } from '../../utils/rollbar.config';

import { SIGN_IN_WITH_REFRESH_TOKEN_MUTATION } from './queries';
import {
  SignInWithRefreshToken,
  SignInWithRefreshTokenVariables,
} from './__generated__/SignInWithRefreshToken';

export const useSignInWithRefreshToken = () => {
  const [error, setError] = useState(AuthError.None);

  const [apiSignInWithRefreshToken, { loading }] = useMutation<
    SignInWithRefreshToken,
    SignInWithRefreshTokenVariables
  >(SIGN_IN_WITH_REFRESH_TOKEN_MUTATION, {
    context: { public: true },
  });

  const signInWithRefreshToken = useCallback(async () => {
    setError(AuthError.None);

    try {
      const refreshToken = await getMissionHubRefreshToken();

      if (!refreshToken) {
        throw new Error(
          'signInWithRefreshToken called when no refresh token has been set',
        );
      }

      const { data } = await apiSignInWithRefreshToken({
        variables: {
          refreshToken,
        },
      });
      const token = data?.loginWithRefreshToken?.token;
      if (!token) {
        throw new Error(
          'apiSignInWithRefreshToken did not return an access token',
        );
      }
      await setAuthToken(token);
      data?.loginWithRefreshToken?.refreshToken &&
        (await setMissionHubRefreshToken(
          data.loginWithRefreshToken.refreshToken,
        ));
    } catch (error) {
      setError(AuthError.Unknown);
      rollbar.error(error);
      throw AuthError.Unknown;
    }
  }, []);

  return {
    signInWithRefreshToken,
    loading,
    error,
  };
};
