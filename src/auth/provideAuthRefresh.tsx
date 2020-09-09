import { AccessToken } from 'react-native-fbsdk';
import { useDispatch } from 'react-redux';

import { logout } from '../actions/auth/auth';

import { useSignInWithFacebook } from './providers/useSignInWithFacebook';
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
  getTheKeyRefreshToken,
  getAnonymousUid,
  getAppleUserId,
} from './authStore';
import { useAuthSuccess } from './authHooks';

export let authRefresh: () => Promise<boolean>;

export const useProvideAuthRefresh = () => {
  const dispatch = useDispatch();

  const { signInWithFacebook } = useSignInWithFacebook();

  const { signInWithTheKey } = useSignInWithTheKey();

  const { signInWithApple } = useSignInWithApple();

  const { signInWithAnonymous } = useSignInWithAnonymous();

  const authSuccess = useAuthSuccess();

  const performRefresh = async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      return false;
    }

    if (await getTheKeyRefreshToken()) {
      await signInWithTheKey({ type: SignInWithTheKeyType.Refresh });
      return true;
    }

    if (await getAnonymousUid()) {
      await signInWithAnonymous({ type: SignInWithAnonymousType.Refresh });
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

    dispatch(logout(true));
    return false;
  };

  authRefresh = async () => {
    const shouldRetry = await performRefresh();
    await authSuccess();
    return shouldRetry;
  };
};
