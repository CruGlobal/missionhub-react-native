jest.mock('react-native-device-info', () => ({
  getDeviceLocale: jest.fn(),
  hasNotch: jest.fn(),
  getBuildNumber: jest.fn(),
}));
