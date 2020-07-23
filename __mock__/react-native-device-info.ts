jest.mock('react-native-device-info', () => ({
  getBuildNumber: jest.fn(),
  getVersion: jest.fn(),
}));
