import { useCallback } from 'react';

import { useSignInWithApple } from './providers/useSignInWithApple';
import { useSignInWithFacebook } from './providers/useSignInWithFacebook';
import { useSignInWithGoogle } from './providers/useSignInWithGoogle';
import {
  useSignInWithTheKey,
  SignInWithTheKeyOptions,
} from './providers/useSignInWithTheKey';
import {
  useSignInWithAnonymous,
  SignInWithAnonymousOptions,
} from './providers/useSignInWithAnonymous';
import { useAuthSuccess } from './authHooks';
import { IdentityProvider } from './constants';

type AuthenticateOptions =
  | {
      provider: Exclude<
        IdentityProvider,
        IdentityProvider.TheKey | IdentityProvider.Anonymous
      >;
    }
  | {
      provider: IdentityProvider.TheKey;
      theKeyOptions: SignInWithTheKeyOptions;
    }
  | {
      provider: IdentityProvider.Anonymous;
      anonymousOptions: SignInWithAnonymousOptions;
    };

export const useAuth = () => {
  const {
    signInWithApple,
    loading: signInWithAppleLoading,
    error: signInWithAppleError,
  } = useSignInWithApple();
  const {
    signInWithFacebook,
    loading: signInWithFacebookLoading,
    error: signInWithFacebookError,
  } = useSignInWithFacebook();
  const {
    signInWithGoogle,
    loading: signInWithGoogleLoading,
    error: signInWithGoogleError,
  } = useSignInWithGoogle();
  const {
    signInWithTheKey,
    loading: signInWithTheKeyLoading,
    error: signInWithTheKeyError,
  } = useSignInWithTheKey();
  const {
    signInWithAnonymous,
    loading: signInWithAnonymousLoading,
    error: signInWithAnonymousError,
  } = useSignInWithAnonymous();

  const authSuccess = useAuthSuccess();

  const authenticate = useCallback(async (options: AuthenticateOptions) => {
    switch (options.provider) {
      case IdentityProvider.Apple:
        await signInWithApple();
        break;
      case IdentityProvider.Google:
        await signInWithGoogle();
        break;
        break;
      case IdentityProvider.Facebook:
        await signInWithFacebook();
        break;
      case IdentityProvider.TheKey:
        await signInWithTheKey(options.theKeyOptions);
        break;
      case IdentityProvider.Anonymous:
        await signInWithAnonymous(options.anonymousOptions);
        break;
    }
    await authSuccess();
  }, []);

  return {
    authenticate,
    loading:
      signInWithAppleLoading ||
      signInWithGoogleLoading ||
      signInWithFacebookLoading ||
      signInWithTheKeyLoading ||
      signInWithAnonymousLoading,
    error:
      signInWithAppleError ||
      signInWithGoogleError ||
      signInWithFacebookError ||
      signInWithTheKeyError ||
      signInWithAnonymousError,
  };
};
