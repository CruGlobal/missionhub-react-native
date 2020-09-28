import * as SecureStore from 'expo-secure-store';

let cachedAuthToken: string | null = null;
const AUTH_TOKEN_KEY = 'authToken';
export const getAuthToken = async () => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  cachedAuthToken = token;
  return token;
};
export const getCachedAuthToken = () => cachedAuthToken;
export const setAuthToken = (newAuthToken: string) => {
  cachedAuthToken = newAuthToken;
  return SecureStore.setItemAsync(AUTH_TOKEN_KEY, newAuthToken);
};
const deleteAuthToken = () => {
  cachedAuthToken = null;
  return SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
};
export const isAuthenticated = () => cachedAuthToken !== null;

const The_KEY_REFRESH_TOKEN_KEY = 'theKeyRefreshToken';
export const getTheKeyRefreshToken = () =>
  SecureStore.getItemAsync(The_KEY_REFRESH_TOKEN_KEY);
export const setTheKeyRefreshToken = (newRefreshToken: string) =>
  SecureStore.setItemAsync(The_KEY_REFRESH_TOKEN_KEY, newRefreshToken);
const deleteTheKeyRefreshToken = () =>
  SecureStore.deleteItemAsync(The_KEY_REFRESH_TOKEN_KEY);

const ANONYMOUS_UID_KEY = 'anonymousUid';
export const getAnonymousUid = () =>
  SecureStore.getItemAsync(ANONYMOUS_UID_KEY);
export const setAnonymousUid = (newAnonymousUid: string) =>
  SecureStore.setItemAsync(ANONYMOUS_UID_KEY, newAnonymousUid);
export const deleteAnonymousUid = () =>
  SecureStore.deleteItemAsync(ANONYMOUS_UID_KEY);

const APPLE_USER_ID_KEY = 'appleUserId';
export const getAppleUserId = () => SecureStore.getItemAsync(APPLE_USER_ID_KEY);
export const setAppleUserId = (newAppleUserId: string) =>
  SecureStore.setItemAsync(APPLE_USER_ID_KEY, newAppleUserId);
const deleteAppleUserId = () => SecureStore.deleteItemAsync(APPLE_USER_ID_KEY);

export const deleteAllAuthTokens = () =>
  Promise.all([
    deleteAuthToken(),
    deleteTheKeyRefreshToken(),
    deleteAnonymousUid(),
    deleteAppleUserId(),
  ]);
