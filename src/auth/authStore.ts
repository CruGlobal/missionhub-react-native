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

const REFRESH_TOKEN_KEY = 'refreshToken';
export const getRefreshToken = () =>
  SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
export const setRefreshToken = (newRefreshToken: string) =>
  SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
const deleteRefreshToken = () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

const ANONYMOUS_UID_KEY = 'anonymousUid';
export const getAnonymousUid = () =>
  SecureStore.getItemAsync(ANONYMOUS_UID_KEY);
export const setAnonymousUid = (newAnonymousUid: string) =>
  SecureStore.setItemAsync(ANONYMOUS_UID_KEY, newAnonymousUid);
export const deleteAnonymousUid = () =>
  SecureStore.deleteItemAsync(ANONYMOUS_UID_KEY);

export const deleteAllAuthTokens = () =>
  Promise.all([deleteAuthToken(), deleteRefreshToken(), deleteAnonymousUid()]);
