jest.mock(
  'react-native/Libraries/Utilities/NativePlatformConstantsIOS',
  () => ({
    ...require.requireActual(
      'react-native/Libraries/Utilities/NativePlatformConstantsIOS',
    ),
    getConstants: () => ({
      forceTouchAvailable: false,
      interfaceIdiom: 'en',
      isTesting: false,
      osVersion: 'ios',
      reactNativeVersion: { major: 60, minor: 1, patch: 0 },
      systemName: 'ios',
    }),
  }),
);
