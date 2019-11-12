jest.mock('@react-native-firebase/dynamic-links', () => ({
  __esModule: true,
  default: jest.fn(),
}));
