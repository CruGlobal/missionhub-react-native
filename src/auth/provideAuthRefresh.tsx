import { AccessToken } from 'react-native-fbsdk';
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-community/google-signin';

import { logout } from '../actions/auth/auth';

import { useSignInWithFacebook } from './providers/useSignInWithFacebook';
import { useSignInWithGoogle } from './providers/useSignInWithGoogle';
import {
  useSignInWithTheKey,
  SignInWithTheKeyType,
} from './providers/useSignInWithTheKey';
import {
  useSignInWithAnonymous,
  SignInWithAnonymousType,
} from './providers/useSignInWithAnonymous';
import { useSignInWithApple } from './providers/useSignInWithApple';
import {
  isAuthenticated,
  getMissionHubRefreshToken,
  getTheKeyRefreshToken,
  getAnonymousUid,
  getAppleUserId,
} from './authStore';
import { useAuthSuccess } from './authHooks';
import { useSignInWithRefreshToken } from './providers/useSignInWithRefreshToken';

// export for use outside of components. useProvideAuthRefresh will set this value
export let authRefresh: () => Promise<boolean>;

export const useProvideAuthRefresh = () => {
  const dispatch = useDispatch();

  const { signInWithFacebook } = useSignInWithFacebook();

  const { signInWithGoogle } = useSignInWithGoogle();

  const { signInWithTheKey } = useSignInWithTheKey();

  const { signInWithApple } = useSignInWithApple();

  const { signInWithAnonymous } = useSignInWithAnonymous();

  const { signInWithRefreshToken } = useSignInWithRefreshToken();

  const authSuccess = useAuthSuccess();

  const performRefresh = async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      return false;
    }

    if (await getAnonymousUid()) {
      await signInWithAnonymous({ type: SignInWithAnonymousType.Refresh });
      return true;
    }

    try {
      try {
        if (await getMissionHubRefreshToken()) {
          await signInWithRefreshToken();
          return true;
        }
      } catch {
        // On error, try refreshing with an auth provider
      }

      if (await getTheKeyRefreshToken()) {
        await signInWithTheKey({ type: SignInWithTheKeyType.Refresh });
        return true;
      }

      const { accessToken } = (await AccessToken.getCurrentAccessToken()) || {};
      if (accessToken) {
        await signInWithFacebook();
        return true;
      }

      const appleId = await getAppleUserId();
      if (appleId) {
        await signInWithApple(appleId);
        return true;
      }

      if (await GoogleSignin.isSignedIn()) {
        await signInWithGoogle();
        return true;
      }
    } catch {
      // On error, we should proceed to logout code below
    }

    dispatch(logout(true));
    return false;
  };

  authRefresh = async () => {
    const shouldRetry = await performRefresh();
    shouldRetry && (await authSuccess());
    return shouldRetry;
  };
};
