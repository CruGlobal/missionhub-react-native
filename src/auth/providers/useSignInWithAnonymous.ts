import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { setAuthToken, setAnonymousUid, getAnonymousUid } from '../authStore';
import { AuthError } from '../constants';
import { rollbar } from '../../utils/rollbar.config';

import {
  SignUpWithAnonymous,
  SignUpWithAnonymousVariables,
} from './__generated__/SignUpWithAnonymous';
import {
  SignInWithAnonymous,
  SignInWithAnonymousVariables,
} from './__generated__/SignInWithAnonymous';
import {
  SIGN_UP_WITH_ANONYMOUS_MUTATION,
  SIGN_IN_WITH_ANONYMOUS_MUTATION,
} from './queries';

export enum SignInWithAnonymousType {
  Create,
  Refresh,
}

export type SignInWithAnonymousOptions =
  | {
      type: SignInWithAnonymousType.Create;
      firstName: string;
      lastName?: string;
    }
  | {
      type: SignInWithAnonymousType.Refresh;
    };

export const useSignInWithAnonymous = () => {
  const [error, setError] = useState(AuthError.None);

  const [apiSignUpWithAnonymous, { loading: signUpLoading }] = useMutation<
    SignUpWithAnonymous,
    SignUpWithAnonymousVariables
  >(SIGN_UP_WITH_ANONYMOUS_MUTATION, {
    context: { public: true },
  });

  const [apiSignInWithAnonymous, { loading: signInLoading }] = useMutation<
    SignInWithAnonymous,
    SignInWithAnonymousVariables
  >(SIGN_IN_WITH_ANONYMOUS_MUTATION, {
    context: { public: true },
  });

  const makeRequest = useCallback(
    async (options: SignInWithAnonymousOptions) => {
      switch (options.type) {
        case SignInWithAnonymousType.Create: {
          const { data } = await apiSignUpWithAnonymous({
            variables: {
              firstName: options.firstName,
              lastName: options.lastName,
            },
          });
          const token = data?.createAnonymousUser?.token;
          const anonymousUid = data?.createAnonymousUser?.anonymousUid;
          if (!token || !anonymousUid) {
            throw new Error(
              'apiSignUpWithAnonymous did not return the required fields',
            );
          }
          await setAnonymousUid(anonymousUid);
          return { token };
        }
        case SignInWithAnonymousType.Refresh: {
          const anonymousUid = await getAnonymousUid();
          if (!anonymousUid) {
            throw new Error('No anonymousUid to use for refreshing');
          }
          const { data } = await apiSignInWithAnonymous({
            variables: {
              anonymousUid,
            },
          });
          const token = data?.loginWithAnonymous?.token;
          if (!token) {
            throw new Error(
              'apiSignInWithAnonymous did not return the required fields',
            );
          }
          return { token };
        }
        default:
          throw new Error('SignInWithAnonymousType not recognized');
      }
    },
    [],
  );

  const signInWithAnonymous = useCallback(
    async (options: SignInWithAnonymousOptions) => {
      setError(AuthError.None);

      try {
        const { token } = await makeRequest(options);
        await setAuthToken(token);
      } catch (error) {
        setError(AuthError.Unknown);
        rollbar.error(error);
        throw AuthError.Unknown;
      }
    },
    [],
  );

  return {
    signInWithAnonymous,
    loading: signUpLoading || signInLoading,
    error: error,
  };
};
