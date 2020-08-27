module.exports = {
  preset: 'jest-expo', // jest-expo is derived from the react-native preset
  setupFiles: [
    '<rootDir>/__mock__/react-native-device-info.ts',
    '<rootDir>/__mock__/react-native-appsflyer.ts',
    '<rootDir>/__mock__/react-native-code-push.js',
    '<rootDir>/__mock__/react-native-datetimepicker.ts',
    '<rootDir>/__mock__/react-native-firebase.ts',
    '<rootDir>/__mock__/react-native-localize.ts',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
    '<rootDir>/__mock__/rollbar-react-native.js',
    '<rootDir>/__mock__/react-native-omniture.js',
    '<rootDir>/__mock__/react-native-reanimated.ts',
    '<rootDir>/__mock__/react-native-push-notification.ts',
    '<rootDir>/__mock__/push-notification-ios.ts',
    '<rootDir>/__mock__/init-i18next.js',
    '<rootDir>/__mock__/apolloClient.ts',
    '<rootDir>/__mock__/react-native-camera.ts',
    '<rootDir>/__mock__/react-native-video.ts',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/__mock__/hideWarnings.ts',
    '<rootDir>/__mock__/resetGlobalMockSeeds.ts',
    '<rootDir>/__mock__/apolloHooks.ts',
    '<rootDir>/__mock__/cleanup.ts',
  ],
  globalSetup: '<rootDir>/__mock__/globalSetup.ts',
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mock__/svgMock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-navigation-redux-helpers|@invertase/react-native-apple-authentication)',
  ],
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}'],
  clearMocks: true,
};
