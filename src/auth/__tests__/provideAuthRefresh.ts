import { AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';

import { renderHookWithContext } from '../../../testUtils';
import { useProvideAuthRefresh, authRefresh } from '../provideAuthRefresh';
import {
  isAuthenticated,
  getTheKeyRefreshToken,
  getAppleUserId,
  getAnonymousUid,
} from '../authStore';
import { useSignInWithTheKey } from '../providers/useSignInWithTheKey';
import { useSignInWithAnonymous } from '../providers/useSignInWithAnonymous';
import { useSignInWithFacebook } from '../providers/useSignInWithFacebook';
import { useSignInWithGoogle } from '../providers/useSignInWithGoogle';
import { useSignInWithApple } from '../providers/useSignInWithApple';
import { logout } from '../../actions/auth/auth';
import { useAuthSuccess } from '../authHooks';

jest.mock('../authStore');
jest.mock('../providers/useSignInWithTheKey');
jest.mock('../providers/useSignInWithAnonymous');
jest.mock('../providers/useSignInWithFacebook');
jest.mock('../providers/useSignInWithGoogle');
jest.mock('../providers/useSignInWithApple');
jest.mock('react-native-fbsdk', () => ({
  AccessToken: { getCurrentAccessToken: jest.fn() },
}));
jest.mock('../../actions/auth/auth', () => ({
  logout: jest.fn(() => ({ type: 'logout' })),
}));
jest.mock('../authHooks');

const token = 'test token';

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

beforeEach(() => {
  (isAuthenticated as jest.Mock).mockReturnValue(true);
  (getTheKeyRefreshToken as jest.Mock).mockResolvedValue(null);
  (getAnonymousUid as jest.Mock).mockResolvedValue(null);
  (AccessToken.getCurrentAccessToken as jest.Mock).mockResolvedValue(null);
  (GoogleSignin.isSignedIn as jest.Mock).mockResolvedValue(false);
  (getAppleUserId as jest.Mock).mockResolvedValue(null);

  renderHookWithContext(() => useProvideAuthRefresh());
});

it('should return false for unauthenticated users', async () => {
  (isAuthenticated as jest.Mock).mockReturnValue(false);

  expect(await authRefresh()).toEqual(false);
  expect(authSuccess).not.toHaveBeenCalled();
});

it('should return true if a key refresh token exists', async () => {
  (getTheKeyRefreshToken as jest.Mock).mockResolvedValue(token);

  expect(await authRefresh()).toEqual(true);
  expect(signInWithTheKey).toHaveBeenCalled();
  expect(authSuccess).toHaveBeenCalled();
});

it('should return true if an anonymous user id exists', async () => {
  (getAnonymousUid as jest.Mock).mockResolvedValue(token);

  expect(await authRefresh()).toEqual(true);
  expect(signInWithAnonymous).toHaveBeenCalled();
  expect(authSuccess).toHaveBeenCalled();
});

it('should return true if a Facebook access token exists', async () => {
  (AccessToken.getCurrentAccessToken as jest.Mock).mockResolvedValue({
    accessToken: token,
  });

  expect(await authRefresh()).toEqual(true);
  expect(signInWithFacebook).toHaveBeenCalled();
  expect(authSuccess).toHaveBeenCalled();
});

it('should return true if a Google sign in exists', async () => {
  (GoogleSignin.isSignedIn as jest.Mock).mockResolvedValue(true);

  expect(await authRefresh()).toEqual(true);
  expect(signInWithGoogle).toHaveBeenCalled();
  expect(authSuccess).toHaveBeenCalled();
});

it('should return true if an Apple user id exists', async () => {
  (getAppleUserId as jest.Mock).mockResolvedValue(token);

  expect(await authRefresh()).toEqual(true);
  expect(signInWithApple).toHaveBeenCalledWith(token);
  expect(authSuccess).toHaveBeenCalled();
});

it('should return false and logout if no auth providers are available for refreshing', async () => {
  expect(await authRefresh()).toEqual(false);

  expect(logout).toHaveBeenCalledWith(true);
  expect(authSuccess).not.toHaveBeenCalled();
});
