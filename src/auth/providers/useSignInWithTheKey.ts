import Buffer from 'buffer';

import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import base64url from 'base64-url';
import { sha256 } from 'js-sha256';
import { Linking, AppState, AppStateStatus } from 'react-native';
import randomString from 'random-string';
import Config from 'react-native-config';

import { THE_KEY_CLIENT_ID, ACTIONS } from '../../constants';
import callApi from '../../actions/api';
import { REQUESTS, ApiRouteConfigEntry } from '../../api/routes';
import { trackActionWithoutData } from '../../actions/analytics';
import {
  setAuthToken,
  getAnonymousUid,
  getRefreshToken,
  setRefreshToken,
  deleteAnonymousUid,
} from '../authStore';
import { AuthError } from '../constants';
import { rollbar } from '../../utils/rollbar.config';

import { SIGN_IN_WITH_THE_KEY_MUTATION } from './queries';
import {
  SignInWithTheKey,
  SignInWithTheKeyVariables,
} from './__generated__/SignInWithTheKey';

export enum SignInWithTheKeyType {
  EmailPassword,
  SignUp,
  ForgotPassword,
  Refresh,
}

export type SignInWithTheKeyOptions =
  | { type: Exclude<SignInWithTheKeyType, SignInWithTheKeyType.EmailPassword> }
  | {
      type: SignInWithTheKeyType.EmailPassword;
      email: string;
      password: string;
      mfaCode?: string;
    };

const redirectUri = 'https://missionhub.com/auth';

export const useSignInWithTheKey = () => {
  const [providerAuthInProgress, setProviderAuthInProgress] = useState(false);
  const [error, setError] = useState(AuthError.None);
  const dispatch = useDispatch();

  const [apiSignInWithTheKey, { loading }] = useMutation<
    SignInWithTheKey,
    SignInWithTheKeyVariables
  >(SIGN_IN_WITH_THE_KEY_MUTATION, {
    context: { public: true },
  });

  const openKeyURL = useCallback((baseURL: string): Promise<{
    code: string;
    codeVerifier: string;
  }> => {
    global.Buffer = global.Buffer || Buffer.Buffer;

    const string = randomString({
      length: 50,
      numeric: true,
      letters: true,
      special: false,
    });
    const codeVerifier = base64url.encode(string);
    const codeChallenge = base64url.encode(
      (sha256.array(codeVerifier) as unknown) as string,
    );

    const uri =
      `${Config.THE_KEY_URL}${baseURL}&client_id=${THE_KEY_CLIENT_ID}&response_type=code` +
      `&redirect_uri=${redirectUri}&scope=fullticket%20extended&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    return new Promise((resolve, reject) => {
      const onLinkBack = (event: { url: string }) => {
        Linking.removeEventListener('url', onLinkBack);
        const code = event.url.split('code=')[1];
        resolve({ code, codeVerifier });
      };

      Linking.addEventListener('url', onLinkBack);

      Linking.openURL(uri);

      const onAppStateChange = (state: AppStateStatus): void => {
        if (state === 'active') {
          AppState.removeEventListener('change', onAppStateChange);
          reject(AuthError.None);
        }
      };

      AppState.addEventListener('change', onAppStateChange);
    });
  }, []);

  const makeAccessTokenRequest = useCallback(
    async (request: ApiRouteConfigEntry, params: string) => {
      const { access_token, refresh_token } = ((await dispatch(
        callApi(request, {}, params),
      )) as unknown) as { access_token: string; refresh_token?: string };
      refresh_token && setRefreshToken(refresh_token);
      return access_token;
    },
    [],
  );

  const getAccessToken = useCallback(
    async (options: SignInWithTheKeyOptions) => {
      switch (options.type) {
        case SignInWithTheKeyType.Refresh: {
          const refreshToken = await getRefreshToken();
          if (refreshToken) {
            return makeAccessTokenRequest(
              REQUESTS.KEY_REFRESH_TOKEN,
              `grant_type=refresh_token&refresh_token=${refreshToken}`,
            );
          } else {
            throw new Error('No refreshToken stored');
          }
        }
        case SignInWithTheKeyType.EmailPassword: {
          const { email, password, mfaCode } = options;
          return makeAccessTokenRequest(
            REQUESTS.KEY_LOGIN,
            `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended&username=${encodeURIComponent(
              email,
            )}&password=${encodeURIComponent(password)}${
              mfaCode ? `&thekey_mfa_token=${mfaCode}` : ''
            }`,
          );
        }
        case SignInWithTheKeyType.SignUp: {
          const { code, codeVerifier } = await openKeyURL(
            'login?action=signup',
          );
          return makeAccessTokenRequest(
            REQUESTS.KEY_LOGIN,
            `grant_type=authorization_code&client_id=${THE_KEY_CLIENT_ID}&code=${code}&code_verifier=${codeVerifier}&redirect_uri=${redirectUri}`,
          );
        }
        case SignInWithTheKeyType.ForgotPassword: {
          const { code, codeVerifier } = await openKeyURL(
            'service/selfservice?target=displayForgotPassword',
          );
          return makeAccessTokenRequest(
            REQUESTS.KEY_LOGIN,
            `grant_type=authorization_code&client_id=${THE_KEY_CLIENT_ID}&code=${code}&code_verifier=${codeVerifier}&redirect_uri=${redirectUri}`,
          );
        }
        default:
          throw new Error('SignInWithTheKeyType was not specified');
      }
    },
    [],
  );

  const getTicket = useCallback(
    async (access_token: string) =>
      (((await dispatch(
        callApi(REQUESTS.KEY_GET_TICKET, { access_token }, {}),
      )) as unknown) as {
        ticket: string;
      }).ticket,
    [],
  );

  const signInWithTheKey = useCallback(
    async (options: SignInWithTheKeyOptions) => {
      setError(AuthError.None);
      setProviderAuthInProgress(true);

      try {
        const accessToken = await getAccessToken(options);
        const ticket = await getTicket(accessToken);

        const anonymousUid = await getAnonymousUid();
        const { data } = await apiSignInWithTheKey({
          variables: {
            accessToken: ticket,
            anonymousUid,
          },
        });

        if (data?.loginWithTheKey?.token) {
          await setAuthToken(data.loginWithTheKey.token);
          await deleteAnonymousUid();
        } else {
          throw new Error('apiSignInWithTheKey did not return an access token');
        }
      } catch (error) {
        handleError(
          error,
          options.type === SignInWithTheKeyType.EmailPassword &&
            !!options.mfaCode,
        );
      } finally {
        setProviderAuthInProgress(false);
      }
    },
    [],
  );

  const handleError = useCallback(
    (
      error:
        | AuthError.None
        | {
            apiError?: { error?: string; thekey_authn_error?: string };
          },
      isMfaCodePresent: boolean,
    ) => {
      if (error === AuthError.None) {
        throw error;
      }

      const apiError = error?.apiError;

      if (
        apiError?.error === 'invalid_request' ||
        apiError?.thekey_authn_error === 'invalid_credentials'
      ) {
        setError(AuthError.CredentialsIncorrect);
        dispatch(trackActionWithoutData(ACTIONS.USER_ERROR));
        throw AuthError.CredentialsIncorrect;
      } else if (apiError?.thekey_authn_error === 'email_unverified') {
        setError(AuthError.EmailUnverified);
        dispatch(trackActionWithoutData(ACTIONS.USER_ERROR));
        throw AuthError.EmailUnverified;
      } else if (apiError?.thekey_authn_error === 'mfa_required') {
        if (isMfaCodePresent) {
          setError(AuthError.MfaIncorrect);
          throw AuthError.MfaIncorrect;
        } else {
          setError(AuthError.MfaRequired);
          throw AuthError.MfaRequired;
        }
      } else {
        setError(AuthError.Unknown);
        rollbar.error(error);
        dispatch(trackActionWithoutData(ACTIONS.SYSTEM_ERROR));
        throw error;
      }
    },
    [],
  );

  return {
    signInWithTheKey,
    loading: providerAuthInProgress || loading,
    error: error,
  };
};
