jest.mock('react-native-device-info', () => ({
  getBuildNumber: jest.fn(),
}));
