jest.mock('react-native-device-info', () => ({
  useIsEmulator: () => false,
  getBuildNumber: jest.fn(),
  getVersion: jest.fn(),
}));
