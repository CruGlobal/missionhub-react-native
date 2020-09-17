// Use https://github.com/react-native-community/google-signin/pull/492 if it's merged in the future
import { NativeModules } from 'react-native';

export const mockUserInfo = {
  idToken: 'mockIdToken',
  accessToken: null,
  accessTokenExpirationDate: null, // DEPRECATED, on iOS it's a time interval since now in seconds, on Android it's always null
  serverAuthCode: 'mockServerAuthCode',
  scopes: [], // on iOS this is empty array if no additional scopes are defined
  user: {
    email: 'mockEmail',
    id: 'mockId',
    givenName: 'mockGivenName',
    familyName: 'mockFamilyName',
    photo: 'mockPhotoUtl',
    name: 'mockFullName',
  },
};

jest.mock('@react-native-community/google-signin', () => ({
  ...require.requireActual('@react-native-community/google-signin'),
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve(mockUserInfo)),
    signInSilently: jest.fn(() => Promise.resolve(mockUserInfo)),
    isSignedIn: jest.fn(() => Promise.resolve(true)),
    revokeAccess: jest.fn(() => Promise.resolve(true)),
    signOut: jest.fn(() => Promise.resolve(true)),
  },
}));

NativeModules.RNGoogleSignin = {
  BUTTON_SIZE_ICON: 0,
  BUTTON_SIZE_STANDARD: 0,
  BUTTON_SIZE_WIDE: 0,
  BUTTON_COLOR_AUTO: 0,
  BUTTON_COLOR_LIGHT: 0,
  BUTTON_COLOR_DARK: 0,
  SIGN_IN_CANCELLED: '0',
  IN_PROGRESS: '1',
  PLAY_SERVICES_NOT_AVAILABLE: '2',
  SIGN_IN_REQUIRED: '3',
  configure: jest.fn(),
  currentUserAsync: jest.fn(),
};
