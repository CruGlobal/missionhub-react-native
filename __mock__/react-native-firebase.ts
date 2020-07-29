jest.mock('@react-native-firebase/dynamic-links', () => ({
  __esModule: true as const,
  default: jest.fn(),
}));
