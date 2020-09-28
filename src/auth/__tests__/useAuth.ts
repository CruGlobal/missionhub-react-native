import { renderHook } from '@testing-library/react-hooks';

import { useAuth } from '../useAuth';
import { IdentityProvider } from '../constants';
import {
  useSignInWithTheKey,
  SignInWithTheKeyType,
  SignInWithTheKeyOptions,
} from '../providers/useSignInWithTheKey';
import {
  useSignInWithAnonymous,
  SignInWithAnonymousOptions,
  SignInWithAnonymousType,
} from '../providers/useSignInWithAnonymous';
import { useSignInWithFacebook } from '../providers/useSignInWithFacebook';
import { useSignInWithGoogle } from '../providers/useSignInWithGoogle';
import { useSignInWithApple } from '../providers/useSignInWithApple';
import { useAuthSuccess } from '../authHooks';

jest.mock('../providers/useSignInWithTheKey');
jest.mock('../providers/useSignInWithAnonymous');
jest.mock('../providers/useSignInWithFacebook');
jest.mock('../providers/useSignInWithGoogle');
jest.mock('../providers/useSignInWithApple');
jest.mock('../authHooks');

const signInWithTheKey = jest.fn();
(useSignInWithTheKey as jest.Mock).mockReturnValue({ signInWithTheKey });
const signInWithAnonymous = jest.fn();
(useSignInWithAnonymous as jest.Mock).mockReturnValue({ signInWithAnonymous });
const signInWithFacebook = jest.fn();
(useSignInWithFacebook as jest.Mock).mockReturnValue({ signInWithFacebook });
const signInWithGoogle = jest.fn();
(useSignInWithGoogle as jest.Mock).mockReturnValue({ signInWithGoogle });
const signInWithApple = jest.fn();
(useSignInWithApple as jest.Mock).mockReturnValue({ signInWithApple });
const authSuccess = jest.fn();
(useAuthSuccess as jest.Mock).mockReturnValue(authSuccess);

it('should authenticate with Apple', async () => {
  const { result } = renderHook(() => useAuth());

  await result.current.authenticate({ provider: IdentityProvider.Apple });

  expect(signInWithApple).toHaveBeenCalled();
  expect(authSuccess).toHaveBeenCalled();
});

it('should authenticate with Google', async () => {
  const { result } = renderHook(() => useAuth());

  await result.current.authenticate({
    provider: IdentityProvider.Google,
  });

  expect(signInWithGoogle).toHaveBeenCalled();
  expect(authSuccess).toHaveBeenCalled();
});

it('should authenticate with Facebook', async () => {
  const { result } = renderHook(() => useAuth());

  await result.current.authenticate({ provider: IdentityProvider.Facebook });

  expect(signInWithFacebook).toHaveBeenCalled();
  expect(authSuccess).toHaveBeenCalled();
});

it('should authenticate with The Key', async () => {
  const theKeyOptions: SignInWithTheKeyOptions = {
    type: SignInWithTheKeyType.SignUp,
  };

  const { result } = renderHook(() => useAuth());

  await result.current.authenticate({
    provider: IdentityProvider.TheKey,
    theKeyOptions,
  });

  expect(signInWithTheKey).toHaveBeenCalledWith(theKeyOptions);
  expect(authSuccess).toHaveBeenCalled();
});

it('should authenticate with Anonymous', async () => {
  const anonymousOptions: SignInWithAnonymousOptions = {
    type: SignInWithAnonymousType.Refresh,
  };

  const { result } = renderHook(() => useAuth());

  await result.current.authenticate({
    provider: IdentityProvider.Anonymous,
    anonymousOptions,
  });

  expect(signInWithAnonymous).toHaveBeenCalledWith(anonymousOptions);
  expect(authSuccess).toHaveBeenCalled();
});
