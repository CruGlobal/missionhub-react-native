jest.mock('react-native-device-info', () => ({
  getDeviceLocale: jest.fn(() => 'en-TEST'),
  hasNotch: jest.fn(),
  getBuildNumber: jest.fn(),
}));
