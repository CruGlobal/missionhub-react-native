jest.mock('react-native-device-info', () => ({
  getDeviceLocale: jest.fn(() => 'en-US'),
  hasNotch: jest.fn(),
  getBuildNumber: jest.fn(),
}));
